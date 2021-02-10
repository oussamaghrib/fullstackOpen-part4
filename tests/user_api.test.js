const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const bcrypt = require("bcryptjs");

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekreto", 10);
  const user = new User({
    username: "root",
    name: "root user",
    password: passwordHash,
  });

  await user.save();
});
test("getting users", async () => {
  const users = await api
    .get("/api/users")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  console.log(users.body);
});
describe("adding users", () => {
  test("adding users successfuly", async () => {
    const newUser = {
      name: "john oliver",
      username: "karana",
      password: "ooiiu",
    };
    await api.post("/api/users").send(newUser).expect(200);
  });
  test("username must be atleast 3 charecters long", async () => {
    const newUser = {
      name: "john oliver",
      username: "ka",
      password: "ooiiu",
    };
    await api.post("/api/users").send(newUser).expect(400);
  });
  test("password must be atleast 3 charecters long", async () => {
    const newUser = {
      name: "john oliver",
      username: "karma",
      password: "oo",
    };
    await api.post("/api/users").send(newUser).expect(400);
  });
  test("username must be unique", async () => {
    const newUser = {
      name: "john oliver",
      username: "root",
      password: "oooio[",
    };
    await api.post("/api/users").send(newUser).expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
