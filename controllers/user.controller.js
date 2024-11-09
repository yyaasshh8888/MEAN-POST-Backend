const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.signUpUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const User = new UserModel({
      email: req.body.email,
      password: hash,
    });
    const result = await User.save();
    return res.status(201).json({
      message: "User registered successfully",
      result: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message,
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });
    bcrypt.compare(req.body.password, user.password).then((passwordMatch) => {
      console.log("passwordMatch", passwordMatch);
      if (!passwordMatch)
        return res.status(500).json({
          message: "Invalid password",
        });

      const token = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Success",
        token,
        expiresIn: 3600,
        userId: user._id,
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Invalid authentication credentials",
    });
  }
};
