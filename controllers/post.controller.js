const Post = require("../models/post.model");

exports.createPost = (req, res, next) => {
  try {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      ...req.body,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
    post.save().then((record) => {
      res.status(201).json({
        message: "Post created successfully",
        post: {
          id: post._id,
          ...post,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Post creation failed!",
    });
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const currentPage = +req.query.page;
    const pageSize = req.query.pagesize;

    const postQuery = Post.find();
    if (pageSize && currentPage) {
      postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    const posts = await postQuery;
    const totalCount = await Post.countDocuments();

    res.status(200).json({
      message: "Posts fetched successfully.",
      posts: posts,
      totalCount: totalCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch posts!",
    });
  }
};

exports.deletePostById = async (req, res, next) => {
  try {
    const result = await Post.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId,
    });
    if (result.deletedCount) {
      res.status(200).json({
        message: "Post Deleted successfully",
      });
    } else {
      res.status(401).json({
        message: "Not authorized",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete post!",
    });
  }
};

exports.updatePostById = (req, res, next) => {
  try {
    const url = req.protocol + "://" + req.get("host");
    let imagePath = req.body.imagePath;
    if (req.file) {
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      ...req.body,
      imagePath: imagePath,
      creator: req.userData.userId,
    });
    // console.log(req.file, post);
    post._id = req.params.id;
    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    ).then((record) => {
      if (record.modifiedCount) {
        res.status(200).json({
          message: "Post updated successfully",
          postId: record._id,
        });
      } else {
        res.status(401).json({
          message: "Not authorized",
          postId: record._id,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to update post!",
    });
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      return res.status(200).json(post);
    } else {
      return res.status(404).json({ message: "Post Not Found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Unable to get post!",
    });
  }
};
