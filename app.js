const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");

mongoose.connect(config.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);

const mongoUrl = config.MONGODB_URL;

module.exports = app;
