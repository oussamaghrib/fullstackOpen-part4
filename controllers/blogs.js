require("dotenv").config();
const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user");
  res.json(blogs);
});

blogsRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const blog = await Blog.findById(id).populate("user");
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
});

blogsRouter.post("/", async (req, res, next) => {
  const body = req.body;

  const token = req.token;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);
  console.log(user);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  try {
    const result = await blog.save();
    user.blogs = user.blogs.concat(result.id);
    await user.save();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

blogsRouter.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  const blogSubmitter = await blog.user;

  try {
    const token = req.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (decodedToken.id.toString() === blogSubmitter.toString()) {
      await Blog.findByIdAndDelete(id);
      res.status(204).end();
    } else res.json({ error: "only user who submitted a blog can delete it" });
  } catch (err) {
    next(err);
  }
});

blogsRouter.put("/:id", async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;

  const blog = {
    likes: body.likes,
  };
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
    res.status(204).json(updatedBlog);
  } catch (err) {
    next(err);
  }
});

module.exports = blogsRouter;
