const File = require("../files/filesModel");
const {
  uploadImageToS3,
  uploadVideoToS3,
  uploadAudioToS3,
  uploadOtherToS3,
} = require("./multerConfig");

exports.uploadImage = async (req, res) => {
  try {
    const user = await req.userIn();

    const file = req.file;

    // const s3Url = await uploadImageToS3(file);
    // console.log(file);

    const newFile = new File({
      user: user._id,
      name: file.originalname,
      path: file.location,
      file: file,
    });
    await newFile.save();
    delete newFile.file;

    res.status(200).json({ message: "File uploaded successfully", newFile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.uploadVideo = async (req, res) => {
  try {
    const user = await req.userIn();

    const file = req.file;

    const s3Url = await uploadVideoToS3(file);

    const newFile = new File({
      user: user._id,
      name: file.originalname,
      path: s3Url,
    });
    await newFile.save();

    // const file = new File({
    //   user: user._id,
    //   name: req.file.originalname,
    //   path: req.file.location,
    //   key: req.file.key,
    // });
    // await file.save();
    res
      .status(200)
      .json({ message: "File uploaded successfully", path: s3Url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.uploadAudio = async (req, res) => {
  try {
    const user = await req.userIn();

    const file = req.file;

    const s3Url = await uploadAudioToS3(file);

    const newFile = new File({
      user: user._id,
      name: file.originalname,
      path: s3Url,
    });
    await newFile.save();

    // const file = new File({
    //   user: user._id,
    //   name: req.file.originalname,
    //   path: req.file.location,
    //   key: req.file.key,
    // });
    // await file.save();
    res
      .status(200)
      .json({ message: "File uploaded successfully", path: s3Url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.uploadOther = async (req, res) => {
  try {
    const user = await req.userIn();

    const file = req.file;

    const s3Url = await uploadOtherToS3(file);

    const newFile = new File({
      user: user._id,
      name: file.originalname,
      path: s3Url,
    });
    await newFile.save();

    // const file = new File({
    //   user: user._id,
    //   name: req.file.originalname,
    //   path: req.file.location,
    //   key: req.file.key,
    // });
    // await file.save();
    res
      .status(200)
      .json({ message: "File uploaded successfully", path: s3Url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
