const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe("api test", () => {
  let headers;
  beforeEach(async () => {
    const user = {
      username: "root",
      password: "secret",
    };
    const loginUser = await api.post("/api/login").send(user);

    headers = {
      Authorization: `Bearer ${loginUser.body.token}`,
    };
  });
  test("application returns the correct amount of blogs", async () => {
    const res = await api.get("/api/blogs");
    expect(res.body).toHaveLength(helper.initialBlogs.length);
  }, 10000);

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 10000);

  test("unique identifier property name is id", async () => {
    const res = await api.get("/api/blogs");
    expect(res.body.id).toBeDefined;
  }, 10000);

  test("create a new blog post", async () => {
    const newBlog = {
      title: "creating a new blog item test",
      author: "Ariful Islam",
      url: "www.yahoo.com",
      likes: 13,
      userId: "64c7f7e3ef0d1e9a5b9fda45",
    };

    await api
      .post("/api/blogs")
      .set(headers)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await helper.blogsInDb();
    expect(response).toHaveLength(helper.initialBlogs.length + 1);

    const contents = response.map((r) => r.title);
    expect(contents).toContain("creating a new blog item test");
  }, 10000);

  test.only("creating a new blog fails if a token is not provided and gives proper code", async () => {
    const newBlog = {
      title: "creating a new blog item test",
      author: "Ariful Islam",
      url: "www.yahoo.com",
      likes: 13,
      userId: "64c7f7e3ef0d1e9a5b9fda45",
    };

    await api.post("/api/blogs").send(newBlog).expect(401);

    const response = await helper.blogsInDb();
    expect(response).toHaveLength(helper.initialBlogs.length);

    const contents = response.map((r) => r.title);
    expect(contents).not.toContain("creating a new blog item test");
  }, 10000);

  test("like properties missing from blog", async () => {
    const newBlog = {
      title: "like properties missing",
      author: "Ariful Islam",
      url: "www.example.com",
      userId: "64c7f7e3ef0d1e9a5b9fda45",
    };
    const res = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const likes = res.body.likes;
    expect(likes).toBe(0);
  }, 10000);

  test("title or url properties are missing", async () => {
    const newBlog = {
      author: "Ariful Islam",
      likes: 20,
    };
    await api.post("/api/blogs").send(newBlog).expect(400);
  }, 10000);
});

describe("deletion of a blog", () => {
  test("sucess with status code if id is valid", async () => {
    const blogAtStart = await helper.blogsInDb();
    const blogToBeDeleted = blogAtStart[0].id;

    await api.delete(`/api/blogs/${blogToBeDeleted}`).expect(204);

    const blogAtEnd = await helper.blogsInDb();
    expect(blogAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const id = blogAtEnd.map((item) => item.id);
    expect(id).not.toContain(blogToBeDeleted);
  }, 10000);
});

describe("updating impormation of an individual blog", () => {
  test("update the number of likes in a blog", async () => {
    const blogAtStart = await helper.blogsInDb();
    const blogToBeUpdated = blogAtStart[0];
    blogToBeUpdated.likes = 55;

    await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(blogToBeUpdated)
      .expect(200);

    const blogAtEnd = await helper.blogsInDb();
    const likes = blogAtEnd.map((item) => item.likes);
    expect(likes).toContain(55);
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secret", 10);
    const user = new User({
      username: "root",
      name: "Superuser",
      passwordHash,
    });
    await user.save();
  });

  test("creation successed with a fresh username", async () => {
    const userAtStart = await helper.usersInDb();

    const newUser = {
      username: "ariful",
      name: "Ariful Islam",
      password: "secret",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const userAtEnd = await helper.usersInDb();
    expect(userAtEnd).toHaveLength(userAtStart.length + 1);

    const username = userAtEnd.map((item) => item.username);
    expect(username).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const userAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "secret",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const userAtEnd = await helper.usersInDb();
    expect(userAtEnd).toHaveLength(userAtStart.length);
  });
  describe("checking user creation", () => {
    test("user creation fails when password is empty", async () => {
      const userAtStart = await helper.usersInDb();

      const newUser = {
        username: "ariful",
        name: "Ariful Islam",
        password: "",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(result.body.error).toContain("invalid password");

      const userAtEnd = await helper.usersInDb();
      expect(userAtEnd).toHaveLength(userAtStart.length);
    });
    test("user creation fails when password is less than 3 character", async () => {
      const userAtStart = await helper.usersInDb();

      const newUser = {
        username: "ariful",
        name: "Ariful Islam",
        password: "se",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(result.body.error).toContain("invalid password");

      const userAtEnd = await helper.usersInDb();
      expect(userAtEnd).toHaveLength(userAtStart.length);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
