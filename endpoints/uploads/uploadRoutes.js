const router = require("express").Router();
const { uploadImageToS3, uploadVideoToS3, uploadAudioToS3, uploadOtherToS3 } = require("./multerConfig");

const {
  upload,
  uploadVideo,
} = require("./uploadsController");

router.post("/image", uploadImageToS3.single("file"), upload);
router.post("/video", uploadVideoToS3.single("file"), uploadVideo);
router.post("/audio", uploadAudioToS3.single("file"), upload);
router.post("/other", uploadOtherToS3.single("file"), upload);

module.exports = router;
