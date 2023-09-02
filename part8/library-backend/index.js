const { ApolloServer } = require("@apollo/server");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { expressMiddleware } = require("@apollo/server/express4");
const express = require("express");
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { info } = require("./utils/logger");

const User = require("./models/user");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;
info("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    info("connected to MongoDB");
  })
  .catch((error) => {
    info("error connection to MongoDB:", error.message);
  });

mongoose.set("debug", true);

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith("bearer ")) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET
          );
          const currentUser = await User.findById(decodedToken.id).populate(
            "favoriteGenre"
          );
          return { currentUser };
        }
      },
    })
  );
  const PORT = 4000;

  httpServer.listen(PORT, () =>
    info(`Server is now running on http://localhost:${PORT}`)
  );
};

start();
