const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const PostController = require("../controllers/post.controller");
const fileMiddleware = require("../middlewares/file.middleware");

router.post("", authMiddleware, fileMiddleware, PostController.createPost);

router.get("", PostController.getPosts);

router.delete("/:id", authMiddleware, PostController.deletePostById);

router.put(
  "/:id",
  authMiddleware,
  fileMiddleware,
  PostController.updatePostById
);

router.get("/:id", PostController.getPostById);

module.exports = router;
