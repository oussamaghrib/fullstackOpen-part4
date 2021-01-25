const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((blog) => {
      if (blog) {
        res.json(blog);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

blogsRouter.post("/", async (req, res, next) => {
  const blog = new Blog(req.body);

  try {
    const result = await blog.save();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

blogsRouter.delete("/", (req, res, next) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

blogsRouter.put("/:id", (req, res, next) => {
  const body = req.body;
  const id = req.params.id;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  Blog.findByIdAndUpdate(id, blog, { new: true })
    .then((updatedBlog) => {
      res.json(updatedBlog);
    })
    .catch((err) => next(err));
});

module.exports = blogsRouter;
