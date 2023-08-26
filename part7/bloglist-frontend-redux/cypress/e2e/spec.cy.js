describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    const user = {
      username: "root",
      name: "Superuser",
      password: "secret",
    };
    cy.request("POST", "http://localhost:3003/api/users", user);
    const user2 = {
      username: "ariful",
      name: "Ariful Islam",
      password: "secret",
    };
    cy.request("POST", "http://localhost:3003/api/users", user2);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("log in to application");
    cy.contains("login");
  });

  describe("Login", function () {
    it("success with current credentials", function () {
      cy.get("#username").type("root");
      cy.get("#password").type("secret");
      cy.get("#login-button").click();
      cy.contains("Superuser logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("root");
      cy.get("#password").type("hello");
      cy.get("#login-button").click();
      cy.contains("wrong username or password");
      cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
    });
  });

  describe("When logging in", function () {
    beforeEach(function () {
      cy.get("#username").type("root");
      cy.get("#password").type("secret");
      cy.get("#login-button").click();
    });

    it("A blog can be createed", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("A blog created by cypress");
      cy.get("#author").type("Ariful Islam");
      cy.get("#url").type("www.yahoo.com");
      cy.get("#create-button").click();
      cy.contains("A blog created by cypress");
    });
    describe("when there is blog", function () {
      beforeEach(function () {
        cy.contains("new blog").click();
        cy.get("#title").type("A blog created by cypress");
        cy.get("#author").type("Ariful Islam");
        cy.get("#url").type("www.yahoo.com");
        cy.get("#create-button").click();
      });

      it("users can like a blog", function () {
        cy.contains("view").click();
        cy.contains("like").click();
        cy.contains("likes 1");
      });

      it("user who created a blog can delete it", function () {
        cy.contains("view").click();
        cy.contains("remove").click();
        cy.contains("A blog created by cypress").should("not.exist");
      });

      it("only creator can see the delete button", function () {
        cy.contains("logout").click();
        cy.get("#username").type("ariful");
        cy.get("#password").type("secret");
        cy.get("#login-button").click();
        cy.contains("view").click();
        cy.contains("remove").should("not.exist");
      });
    });
    describe.only("blogs are ordered according to likes", function () {
      beforeEach(function () {
        cy.get("#new-blog-button").click();
        cy.get("#title").type("blog with like 1");
        cy.get("#author").type("Ariful Islam");
        cy.get("#url").type("www.yahoo.com");
        cy.get("#create-button").click();

        cy.get("#new-blog-button").click();
        cy.get("#title").type("blog with like 2");
        cy.get("#author").type("Ariful Islam");
        cy.get("#url").type("www.yahoo.com");
        cy.get("#create-button").click();

        cy.get("#new-blog-button").click();
        cy.get("#title").type("blog with like 3");
        cy.get("#author").type("Ariful Islam");
        cy.get("#url").type("www.yahoo.com");
        cy.get("#create-button").click();

        cy.contains("blog with like 1")
          .find("button")
          .should("contain", "view")
          .click();
        cy.contains("blog with like 1")
          .parent()
          .find("button#like")
          .as("button1");

        cy.contains("blog with like 2")
          .find("button")
          .should("contain", "view")
          .click();
        cy.contains("blog with like 2")
          .parent()
          .find("button#like")
          .as("button2");

        cy.contains("blog with like 3")
          .find("button")
          .should("contain", "view")
          .click();
        cy.contains("blog with like 3")
          .parent()
          .find("button#like")
          .as("button3");
      });
      it("blogs are sorted", function () {
        cy.get("@button1").click();

        cy.get("@button2").click();
        cy.wait(300);
        cy.get("@button2").click();

        cy.get("@button3").click();
        cy.wait(300);
        cy.get("@button3").click();
        cy.wait(300);
        cy.get("@button3").click();
        cy.wait(300);

        cy.get("div").then((blogs) => {
          expect(blogs[0]).to.contain.text("blog with like 1");
          expect(blogs[1]).to.contain.text("blog with like 2");
          expect(blogs[2]).to.contain.text("blog with like 3");
        });
      });
    });
  });
});
