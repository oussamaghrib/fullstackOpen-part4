const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe("GET method tests", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("you can get one blog", async () => {
    const blogToGet = initialBlogs[0]._id;
    const result = await api
      .get(`/api/blogs/${blogToGet}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(result.body).toMatchObject({
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
    });
  });
});

describe("post method tests", () => {
  test("the blog is stored in the correct format", async () => {
    const blog = {
      title: "Introducing Open Web Docs",
      author: "Robert Nyman",
      url: "https://web.dev/open-web-docs/",
      likes: 6,
    };
    const resultBeforePost = await api.get("/api/blogs");
    await api
      .post("/api/blogs")
      .send(blog)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const resultAfterPost = await api.get("/api/blogs");
    expect(resultAfterPost.body).toHaveLength(resultBeforePost.body.length + 1);
  });
  test("a post will have 0 likes by default", async () => {
    const blog = {
      title: "Introduction to RxJS",
      author: "Luis Aviles",
      url: "https://labs.thisdot.co/blog/introduction-to-rxjs",
    };
    const res = await api.post("/api/blogs").send(blog);
    expect(res.body.likes).toBe(0);
  });
  test("you can not add a post wihout a title or url", async () => {
    const blog = {
      author: "Chris Coyier",
      likes: 56,
    };
    const res = await api.post("/api/blogs").send(blog);
    expect(res.status).toBe(400);
  });
});

test("the unique identifier is named id", async () => {
  const res = await api.get("/api/blogs");
  expect(res.body[0].id).toBeDefined();
});

test("a blog post is deleted", async () => {
  const idForBlogToDelete = initialBlogs[0]._id;

  const resultBeforeDelete = await api.get("/api/blogs");

  await api.delete(`/api/blogs/${idForBlogToDelete}`).expect(204);

  const resultAfterDelete = await api.get("/api/blogs");
  expect(resultAfterDelete.body).toHaveLength(
    resultBeforeDelete.body.length - 1
  );
});
test("the blog likes are up by one", async () => {
  const idForBlogToUpdate = initialBlogs[0]._id;
  const resultBeforeUpdate = await api.get(`/api/blogs/${idForBlogToUpdate}`);
  const blogLikes = {
    likes: initialBlogs[0].likes + 1,
  };
  await api.put(`/api/blogs/${idForBlogToUpdate}`).send(blogLikes).expect(204);
  const resultAfterUpdate = await api.get(`/api/blogs/${idForBlogToUpdate}`);
  expect(resultAfterUpdate.body.likes).toBe(resultBeforeUpdate.body.likes + 1);
});
afterAll(() => {
  mongoose.connection.close();
});
