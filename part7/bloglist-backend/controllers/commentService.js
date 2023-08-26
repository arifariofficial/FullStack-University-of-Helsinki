const commentRouter = require("express").Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");

commentRouter.get("/:id/comments", async (request, response) => {
  const { id } = request.params;
  const blog = await Blog.findById(id).populate("comments");
  response.json(blog.comments);
});

commentRouter.post("/:id/comments", async (request, response) => {
  const body = request.body.comment;
  console.log(body);
  const { id } = request.params;
  const blog = await Blog.findById(id);

  const comment = new Comment({
    comment: body,
  });

  const savedComment = await comment.save();
  console.log(savedComment);
  blog.comments = blog.comments.concat(savedComment._id);
  await blog.save();
  response.status(201).json(savedComment.toJSON());
});

module.exports = commentRouter;
