const router = require("express").Router();
const uploadController = require("../app/controllers/uploadController");
const uploadImage = require("../app/middleware/uploadImage");
const auth = require("../app/middleware/auth");

router.post("/upload_avatar", uploadImage, uploadController.uploadAvatar);

module.exports = router;
