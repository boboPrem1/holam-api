const router = require("express").Router();
const { upload, uploadImageToS3, uploadVideoToS3, uploadAudioToS3, uploadOtherToS3 } = require("./multerConfig");

const {
  uploadAudio,
  uploadImage,
  uploadOther,
  uploadVideo,
} = require("./uploadsController");

router.post("/image", uploadImageToS3.single("file"), uploadImage);
router.post("/video", uploadVideoToS3.single("file"), uploadVideo);
router.post("/audio", uploadAudioToS3.single("file"), uploadAudio);
router.post("/other", uploadOtherToS3.single("file"), uploadOther);

module.exports = router;
