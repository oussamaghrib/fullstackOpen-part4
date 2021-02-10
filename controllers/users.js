require("dotenv").config();
const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs");
  res.json(users);
});

usersRouter.post("/", async (req, res, next) => {
  const body = req.body;

  if (body.password.length >= 3) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      name: body.name,
      username: body.username,
      passwordHash,
    });

    try {
      const result = await user.save();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  } else {
    res
      .status(400)
      .json({ error: "password must be atleast 3 charecters long" });
  }
});

module.exports = usersRouter;
