// const File = require("../files/filesModel");
// const {
//   uploadImageToS3,
//   uploadVideoToS3,
//   uploadAudioToS3,
//   uploadOtherToS3,
//   uploadThumbnailToS3,
// } = require("./multerConfig");
// const path = require("path");
// const fs = require("fs");
// const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
// const ffprobePath = require("@ffprobe-installer/ffprobe").path;
// const ffmpeg = require("fluent-ffmpeg");
// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);

// const cdn_url = process.env.CDN_URL;

// const generateThumbnail = (file) => {
//   return new Promise((resolve, reject) => {
//     const outputPath = path.join(
//       __dirname,
//       "temp",
//       `${file.originalname}-thumbnail.png`
//     );

//     console.log(outputPath);

//     ffmpeg(file.location)
//       .screenshot({
//         timestamps: ["50%"],
//         filename: outputPath,
//         size: "320x240",
//       })
//       .on("end", () => {
//         console.log(`Thumbnail generated at: ${outputPath}`); // Vérifiez le chemin
//         resolve(outputPath);
//       })
//       .on("error", (err) => {
//         console.error(`Error generating thumbnail: ${err.message}`);
//         reject(err);
//       });
//   });
// };

// exports.upload = async (req, res) => {
//   try {
//     const user = await req.userIn();

//     const file = req.file;

//     const newFile = new File({
//       user: user._id,
//       name: file.originalname,
//       path: file.location.replace(
//         /https:\/\/cap.first.s3.af-south-1.amazonaws.com\//g,
//         cdn_url
//       ),
//       file: file,
//     });
//     await newFile.save();
//     delete newFile.file;

//     res.status(200).json({ message: "File uploaded successfully", newFile });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// exports.uploadVideo = async (req, res) => {
//   try {
//     const user = await req.userIn();
//     const file = req.file;
//     // console.log(file);
//     // Générer le thumbnail
//     const thumbnailPath = await generateThumbnail(file);

//     // const thumbnailStream = fs.createReadStream(thumbnailPath);

//     // // Créer un nouvel objet req.file pour le thumbnail
//     // req.file = {
//     //   fieldname: "file",
//     //   originalname: `${path.basename(thumbnailPath)}.png`, // Nom du fichier thumbnail
//     //   mimetype: "image/png",
//     //   stream: thumbnailStream,
//     // };

//     // Réassigner temporairement req.file pour l'upload du thumbnail

//     // uploadThumbnailToS3(req, res, async function (err) {
//     //   if (err) {
//     //     return res.status(500).json({ message: "thumb " + err.message });
//     //   }

//     //   // Supprimer le fichier thumbnail local après l'upload
//     //   fs.unlinkSync(thumbnailPath);

//       // Enregistrer le fichier vidéo et le thumbnail dans la base de données
//       const newFile = new File({
//         user: user._id,
//         name: file.originalname,
//       path: file.location.replace(
//         /https:\/\/cap.first.s3.af-south-1.amazonaws.com\//g,
//         cdn_url),
//         thumbnail: thumbnailPath, // URL du thumbnail
//       });

//       await newFile.save();

//       res.status(200).json({ message: "File uploaded successfully", newFile });
//     // });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// exports.uploadAudio = async (req, res) => {
//   try {
//     const user = await req.userIn();

//     const file = req.file;

//     const s3Url = await uploadAudioToS3(file);

//     const newFile = new File({
//       user: user._id,
//       name: file.originalname,
//       path: s3Url,
//     });
//     await newFile.save();

//     // const file = new File({
//     //   user: user._id,
//     //   name: req.file.originalname,
//     //   path: req.file.location,
//     //   key: req.file.key,
//     // });
//     // await file.save();
//     res
//       .status(200)
//       .json({ message: "File uploaded successfully", path: s3Url });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// exports.uploadOther = async (req, res) => {
//   try {
//     const user = await req.userIn();

//     const file = req.file;

//     const s3Url = await uploadOtherToS3(file);

//     const newFile = new File({
//       user: user._id,
//       name: file.originalname,
//       path: s3Url,
//     });
//     await newFile.save();

//     // const file = new File({
//     //   user: user._id,
//     //   name: req.file.originalname,
//     //   path: req.file.location,
//     //   key: req.file.key,
//     // });
//     // await file.save();
//     res
//       .status(200)
//       .json({ message: "File uploaded successfully", path: s3Url });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

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
const s3 = require("./s3");
const { v4: uuidv4 } = require("uuid");
const oldS3 = require("./oldS3");
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const cdn_url = process.env.CDN_URL;

// Fonction pour générer une miniature à partir d'une vidéo
// const generateThumbnail = (file) => {
//   return new Promise((resolve, reject) => {
//     const outputPath = path.join(
//       __dirname,
//       "temp",
//       `${file.originalname}-thumbnail.png`
//     );

//     ffmpeg(file.location)
//       .screenshot({
//         timestamps: ["50%"],
//         filename: outputPath,
//         size: "320x240",
//       })
//       .on("end", () => {
//         console.log(`Thumbnail generated at: ${outputPath}`);
//         resolve(outputPath);
//       })
//       .on("error", (err) => {
//         console.error(`Error generating thumbnail: ${err.message}`);
//         reject(err);
//       });
//   });
// };

const generateThumbnail = (filePath, outputFileName) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(__dirname, "thumbnails", outputFileName);
    ffmpeg(filePath)
      .screenshot({
        timestamps: ["50%"],
        filename: outputPath,
        size: "320x240",
      })
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

// Fonction pour supprimer un fichier temporaire
const deleteTempFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
    console.log(`Temp file deleted: ${filePath}`);
  } catch (err) {
    console.error(`Error deleting temp file: ${err.message}`);
  }
};

// Fonction d'upload générique
const uploadFileToDB = async (user, fileData, thumbnail = null) => {
  const newFile = new File({
    user: user._id,
    name: fileData.originalname,
    path: fileData.location.replace(
      /https:\/\/cap.first.s3.af-south-1.amazonaws.com\//g,
      cdn_url
    ),
    thumbnail: thumbnail ? thumbnail : undefined,
  });
  await newFile.save();
  return newFile;
};

// Fonction d'upload générique
exports.upload = async (req, res) => {
  try {
    const user = await req.userIn();
    const file = req.file;
    const newFile = await uploadFileToDB(user, file);
    res.status(200).json({ message: "File uploaded successfully", newFile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload de vidéo avec génération de miniature
exports.uploadVideo = async (req, res) => {
  try {
    const user = await req.userIn();
    const file = req.file;

    const videoKey = file.key;
    const videoUrl = file.location;
    const thumbnailFileName = `${uuidv4()}-thumbnail.png`;
    const thumbnailPath = await generateThumbnail(
      file.location,
      thumbnailFileName
    );
    const thumbnailKey = `holam/thumbnails/${thumbnailFileName}`;
    const thumbnailUrl = await uploadThumbnailToS3(
      thumbnailPath,
      thumbnailKey,
      cdn_url
    );

    // Uploader la miniature sur S3
    // const thumbnailUrl = await uploadThumbnailToS3(
    //   thumbnailPath,
    //   `${file.originalname}-thumbnail.png`
    // );

    // console.log(thumbnailUrl);

    // // Supprimer la miniature locale après l'upload
    deleteTempFile(thumbnailPath);

    // // Enregistrer le fichier vidéo et la miniature dans la base de données
    const newFile = await uploadFileToDB(user, file, thumbnailUrl);

    res.status(200).json({
      message: "Video and thumbnail uploaded successfully",
      newFile,
    });
  } catch (error) {
    res.status(500).json({ message: `Video upload error: ${error.message}` });
  }
};

// Upload d'audio
exports.uploadAudio = async (req, res) => {
  try {
    const user = await req.userIn();
    const file = req.file;

    const s3Url = await uploadAudioToS3(file);
    const newFile = await uploadFileToDB(user, { ...file, location: s3Url });

    res.status(200).json({ message: "Audio uploaded successfully", newFile });
  } catch (error) {
    res.status(500).json({ message: `Audio upload error: ${error.message}` });
  }
};

// Upload de fichiers divers
exports.uploadOther = async (req, res) => {
  try {
    const user = await req.userIn();
    const file = req.file;

    const s3Url = await uploadOtherToS3(file);
    const newFile = await uploadFileToDB(user, { ...file, location: s3Url });

    res.status(200).json({ message: "File uploaded successfully", newFile });
  } catch (error) {
    res.status(500).json({ message: `File upload error: ${error.message}` });
  }
};

// const uploadThumbnailToS3 = async (filePath, filename) => {
//   const fileContent = fs.readFileSync(filePath);
//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: `thumbnails/${path.basename(filename)}`, // S3 file path
//     Body: fileContent,
//     ContentType: "image/png", // Adjust content type according to your needs
//     ACL: "public-read", // Make the file publicly accessible if needed
//   };

//   try {
//     const uploadResult = await oldS3.upload(params).promise();
//     console.log("Thumbnail uploaded to S3:", uploadResult.Location);
//     return uploadResult.Location; // Return the URL of the uploaded thumbnail
//   } catch (error) {
//     console.error("Error uploading thumbnail to S3:", error);
//     throw new Error("Thumbnail upload failed");
//   }
// };
