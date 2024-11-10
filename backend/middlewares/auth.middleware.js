const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "SUPERSECRET"
    );
    req.userData = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "You're not authenticated",
    });
  }
};
