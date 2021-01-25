require("dotenv").config();

let MONGODB_URL = process.env.MONGODB_URL;

if (process.env.NODE_ENV === "test") {
  MONGODB_URL = process.env.TEST_MONGODB_URI;
}

const PORT = process.env.PORT;

module.exports = {
  MONGODB_URL,
  PORT,
};
