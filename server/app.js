/* eslint-disable no-console */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const users = require("./users");
const blogs = require("./blogs");

mongoose.connect("mongodb://localhost:27017/smog", {
  useNewUrlParser: true
});

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use("/api/users", users.routes);
app.use("/api/blogs", blogs.routes);

app.listen(3002, () => console.log("Server listening on port 3002!"));
