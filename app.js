const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PostRoutes = require("./routes/post.routes");
const UserRoutes = require("./routes/user.routes");
const path = require("path");
mongoose
  .connect(process.env.MONGO_URL || "mongodb://0.0.0.0/node-angular")
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch(() => {
    console.log("DB connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET ,PUT ,POST ,PUT ,DELETE ,OPTIONS "
  );
  next();
});
app.use("/api/posts", PostRoutes);
app.use("/api/user", UserRoutes);

module.exports = app;
