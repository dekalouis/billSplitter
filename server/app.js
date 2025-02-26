// console.log({ env: process.env.NODE_ENV });
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const routes = require("./routers");
const port = process.env.PORT || 3000;

const cors = require("cors");
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(routes);

//commented while testing
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
  });
}
module.exports = app;
