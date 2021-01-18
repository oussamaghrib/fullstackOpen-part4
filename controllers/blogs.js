const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", (req, res) => {
  Blog.find({}).then((blogs) => {
    res.json(blogs);
  });
});

blogsRouter.get("/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id).then((blog) => {
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).end();
    }
  });
});

blogsRouter.post("/", (req, res) => {
  const blog = new Blog(req.body);

  blog.save().then((result) => {
    res.status(201).json(result);
  });
});

blogsRouter.delete("/", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id).then(() => res.status(204).end());
});

blogsRouter.put("/:id", (req, res) => {
  const body = req.body;
  const id = req.params.id;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  Blog.findByIdAndUpdate(id, blog, { new: true }).then((updatedBlog) => {
    res.json(updatedBlog);
  });
});

module.exports = blogsRouter;
