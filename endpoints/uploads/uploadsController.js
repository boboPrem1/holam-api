const File = require("../files/filesModel");
const {
  uploadImageToS3,
  uploadVideoToS3,
  uploadAudioToS3,
  uploadOtherToS3,
  uploadThumbnailToS3,
} = require("./multerConfig");
const path = require("path");
const fs = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const cdn_url = process.env.CDN_URL;

const generateThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(
      __dirname,
      "temp",
      `${file.originalname}-thumbnail.png`
    );

    console.log(outputPath);

    ffmpeg(file.location)
      .screenshot({
        timestamps: ["50%"],
        filename: outputPath,
        size: "320x240",
      })
      .on("end", () => {
        console.log(`Thumbnail generated at: ${outputPath}`); // Vérifiez le chemin
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error(`Error generating thumbnail: ${err.message}`);
        reject(err);
      });
  });
};


exports.upload = async (req, res) => {
  try {
    const user = await req.userIn();

    const file = req.file;

    const newFile = new File({
      user: user._id,
      name: file.originalname,
      path: file.location.replace(
        /http:\/\/cap.first.s3.af-south-1.amazonaws.com\//g,
        cdn_url
      ),
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
    console.log(file);
    // Générer le thumbnail
    const thumbnailPath = await generateThumbnail(file);

    // const thumbnailStream = fs.createReadStream(thumbnailPath);

    // // Créer un nouvel objet req.file pour le thumbnail
    // req.file = {
    //   fieldname: "file",
    //   originalname: `${path.basename(thumbnailPath)}.png`, // Nom du fichier thumbnail
    //   mimetype: "image/png",
    //   stream: thumbnailStream,
    // };

    // Réassigner temporairement req.file pour l'upload du thumbnail

    // uploadThumbnailToS3(req, res, async function (err) {
    //   if (err) {
    //     return res.status(500).json({ message: "thumb " + err.message });
    //   }

    //   // Supprimer le fichier thumbnail local après l'upload
    //   fs.unlinkSync(thumbnailPath);

      // Enregistrer le fichier vidéo et le thumbnail dans la base de données
      const newFile = new File({
        user: user._id,
        name: file.originalname,
      path: file.location.replace(
        /http:\/\/cap.first.s3.af-south-1.amazonaws.com\//g,
        cdn_url),
        thumbnail: thumbnailPath, // URL du thumbnail
      });

    //   await newFile.save();

      res.status(200).json({ message: "File uploaded successfully", newFile });
    // });
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
