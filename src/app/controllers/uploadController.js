const cloudinary = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const UploadController = {
  uploadAvatar: (req, res) => {
    try {
      const file = req.files.file;
      console.log("file: " + file);
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        {
          folder: "bookshop",
          // width: 150,
          // height: 150,
          crop: "fill",
        },
        async (err, result) => {
          if (err) throw err;
          removeTmp(file.tempFilePath);
          console.log("url: ", result.secure_url);
          return res.status(200).json({ url: result.secure_url, file: file });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: "uploadCtrl: " + err.message });
    }
  },
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = UploadController;
