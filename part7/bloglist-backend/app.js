const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");

const blogRouter = require("./controllers/blogService");
const userRouter = require("./controllers/userServices");
const loginRouter = require("./controllers/loginService");
const commentRouter = require("./controllers/commentService");

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testingService");
  app.use("/api/testing", testingRouter);
}

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const logger = require("./utils/logger");
const config = require("./utils/config.js");
const middleware = require("./utils/middleware");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("conncted to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);

app.use("/api/blogs", blogRouter);
app.use("/api/blogs", commentRouter);

app.use(middleware.errorHandler);

module.exports = app;
