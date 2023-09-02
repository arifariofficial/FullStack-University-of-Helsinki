const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const { isEmpty } = require("lodash");

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (isEmpty(args)) return await Book.find({}).populate("author");
      if (args.author) {
        const author = await Author.findOne({ name: args.author }).populate(
          "books"
        );
        return author.books;
      }
      if (args.genre) {
        const book = await Book.find({ genres: args.genre });
        return book;
      }
    },

    allAuthors: async (root, args) => Author.find({}),

    me: (root, args, { currentUser }) => {
      if (isEmpty(currentUser)) {
        throw new GraphQLError("not permitted", {
          extensions: {
            code: "NO_USER_FOUND",
          },
        });
      }
      return currentUser;
    },
  },

  Author: {
    bookCount: async (root) => root.books.length,
  },

  Book: {
    author: async (root) => await Author.findById(root.author),
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      const author = new Author({ name: args.author });
      const book = new Book({ ...args, author: author._id });
      author.books = author.books.concat(book._id);

      if (!currentUser) {
        throw new GraphQLError("User not logged in", {
          extensions: {
            code: "NO_USER_FOUND",
          },
        });
      }

      try {
        await author.save();
        await book.save();
      } catch (error) {
        throw new GraphQLError("Adding book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: `title: ${args.title} or author: ${args.author}`,
            error,
          },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },

    editAuthor: async (root, args, { currentUser }) => {
      const author = await Author.findOne({ name: args.name });
      author.born = args.setBornTo;

      if (!currentUser) {
        throw new GraphQLError("User not logged in", {
          extensions: {
            code: "NO_USER_FOUND",
          },
        });
      }
      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError("Person not updated", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
      return author;
    },

    createUser: async (root, args) => {
      const user = new User({ ...args });

      try {
        await user.save();
      } catch (error) {
        throw new GraphQLError("User creating failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
      return user;
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong crendential", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
