const router = require('express').Router();	

const { UploadImage } = require("./uploadsController");

router.post("/images", UploadImage.single("image"), (req, res) => {
  return res.json({ url: req.file.location });
});

router.post("images/multiple", UploadImage.array("images", 10), (req, res) => {
  return res.send(`Success`);
});

module.exports = router;