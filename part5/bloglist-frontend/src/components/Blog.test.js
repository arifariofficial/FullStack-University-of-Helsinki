import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import Blog from "./Blog";
import BlogForm from "./BlogForm";

test("render blog's title and author but not url and likes", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Ariful Islam",
    likes: 12,
    url: "www.yahoo.com",
  };

  const component = render(<Blog blog={blog} />);

  expect(component.container).toHaveTextContent(
    "Component testing is done with react-testing-library"
  );
  expect(component.container).toHaveTextContent("Ariful Islam");
  expect(component.container).not.toHaveTextContent("3");
  expect(component.container).not.toHaveTextContent("www.yahoo.com");
});

test("URL and likes are shown when the button is clicked", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Ariful Islam",
    likes: 12,
    url: "www.yahoo.com",
    user: {
      name: "Superuser",
      username: "root",
    },
  };

  const loggedUser = "root";

  const component = render(<Blog blog={blog} user={loggedUser} />);

  const viewButton = component.getByText("view");
  fireEvent.click(viewButton);

  expect(component.container).toHaveTextContent("12");
  expect(component.container).toHaveTextContent("www.yahoo.com");
});

test("like button is clicked twice", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Ariful Islam",
    likes: 12,
    url: "www.yahoo.com",
    user: {
      name: "Superuser",
      username: "root",
    },
  };

  const mockHandler = jest.fn();

  const loggedUser = "root";

  const component = render(
    <Blog blog={blog} user={loggedUser} handleLikes={mockHandler} />
  );

  const viewButton = component.getByText("view");
  fireEvent.click(viewButton);

  const likeButton = component.getByRole("button", { name: "like" });

  fireEvent.click(likeButton);
  fireEvent.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});

test("form calls the event handler it received as props with the right details when a new blog is created", () => {
  const createNewBlog = jest.fn();

  const component = render(<BlogForm createNewBlog={createNewBlog} />);

  const title = component.container.querySelector("#title");
  const author = component.container.querySelector("#author");
  const url = component.container.querySelector("#url");
  const form = component.container.querySelector("#form");

  fireEvent.change(title, {
    target: { value: "new blog" },
  });
  fireEvent.change(author, {
    target: { value: "Ariful" },
  });
  fireEvent.change(url, {
    target: { value: "www.yahoo.com" },
  });

  fireEvent.submit(form);

  expect(createNewBlog.mock.calls).toHaveLength(1);
  expect(createNewBlog.mock.calls[0][0].title).toBe("new blog");
  expect(createNewBlog.mock.calls[0][0].author).toBe("Ariful");
  expect(createNewBlog.mock.calls[0][0].url).toBe("www.yahoo.com");
});
