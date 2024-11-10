const multer = require("multer");

const MIME_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let isValid = MIME_TYPES[file.mimetype];
    // console.log(file);
    let error = new Error("File type is not valid");
    if (isValid) {
      error = null;
    }

    cb(error, "assets/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPES[file.mimetype];
    const newFileName = name + "-" + Date.now() + "." + ext;
    cb(null, newFileName);
  },
});

module.exports = multer({ storage: storage }).single("image");
