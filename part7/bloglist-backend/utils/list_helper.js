const _ = require("lodash");
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogList) => {
  return blogList.reduce((acc, item) => {
    return acc + item.likes;
  }, 0);
};

const favoriteBlog = (blogList) => {
  const maxLlikes = blogList.reduce((acc, item) => {
    return acc > item.likes ? acc : item.likes;
  }, 0);
  const result = blogList.find((item) => item.likes === maxLlikes);
  return { title: result.title, author: result.author, likes: result.likes };
};
const mostBlogs = (listWithManyBlog) => {
  const result = _.countBy(listWithManyBlog, "author");
  const author = _.maxBy(Object.keys(result));
  return { author: author, blogs: result[author] };
};
const mostLikes = (blogs) => {
  const result = {};
  const author = {
    author: "",
    likes: 0,
  };

  blogs.forEach((item) => {
    result[item.author] = result[item.author]
      ? result[item.author] + item.likes
      : item.likes;
  });

  for (const [key, value] of Object.entries(result)) {
    if (value > author.likes) {
      author.author = key;
      author.likes = value;
    }
  }
  return author;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
