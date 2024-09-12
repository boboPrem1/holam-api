// const multer = require("multer");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// const path = require("path");
// const multerS3 = require("multer-s3");
// const s3 = require("./s3");
// const fs = require("fs");
// require("dotenv").config();

// const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// const imageStorage = multerS3({
//   s3: s3,
//   bucket: BUCKET_NAME,
//   object: "holam",
//   acl: "public-read",
//   metadata: function (req, file, cb) {
//     cb(null, {
//       fieldName: file.fieldname,
//       mimeType: file.mimetype,
//     });
//   },
//   key: function (req, file, cb) {
//     cb(null, `holam/images/${Date.now()}_${path.basename(file.originalname)}`);
//   },
// });

// const uploadImageToS3 = multer({ storage: imageStorage });

// const videoStorage = multerS3({
//   s3: s3,
//   bucket: BUCKET_NAME,
//   object: "holam",
//   acl: "public-read",
//   metadata: function (req, file, cb) {
//     cb(null, {
//       fieldName: file.fieldname,
//       mimeType: file.mimetype,
//     });
//   },
//   key: function (req, file, cb) {
//     cb(null, `holam/videos/${Date.now()}_${path.basename(file.originalname)}`);
//   },
// });

// const uploadVideoToS3 = multer({ storage: videoStorage });

// const audioStorage = multerS3({
//   s3: s3,
//   bucket: BUCKET_NAME,
//   object: "holam",
//   acl: "public-read",
//   metadata: function (req, file, cb) {
//     cb(null, {
//       fieldName: file.fieldname,
//       mimeType: file.mimetype,
//     });
//   },
//   key: function (req, file, cb) {
//     cb(null, `holam/audios/${Date.now()}_${path.basename(file.originalname)}`);
//   },
// });

// const uploadAudioToS3 = multer({ storage: audioStorage });

// const otherStorage = multerS3({
//   s3: s3,
//   bucket: BUCKET_NAME,
//   object: "holam",
//   acl: "public-read",
//   metadata: function (req, file, cb) {
//     cb(null, {
//       fieldName: file.fieldname,
//       mimeType: file.mimetype,
//     });
//   },
//   key: function (req, file, cb) {
//     cb(null, `holam/others/${Date.now()}_${path.basename(file.originalname)}`);
//   },
// });

// const uploadOtherToS3 = multer({ storage: otherStorage });

// // Fonction pour uploader le thumbnail vers S3
// // const uploadThumbnailToS3 = (thumbnailPath, originalFileName) => {
// //   return new Promise((resolve, reject) => {
// //     const thumbnailFileName = `holam/thumbnails/${path.basename(originalFileName, path.extname(originalFileName))}-thumbnail.png`;

// //     const fileStream = fs.createReadStream(thumbnailPath);
// //     const uploadParams = {
// //       Bucket: BUCKET_NAME,
// //       Key: thumbnailFileName,
// //       Body: fileStream,
// //       ContentType: "image/png",
// //       acl: "public-read",
// //       object: "holam",
// //     };

// //     s3.upload(uploadParams, (err, data) => {
// //       if (err) {
// //         reject(err);
// //       } else {
// //         resolve(data.Location);
// //       }
// //     });
// //   });
// // };

// const thumbnailStorage = multerS3({
//   s3: s3,
//   bucket: BUCKET_NAME,
//   object: "holam",
//   acl: "public-read",
//   metadata: function (req, file, cb) {
//     cb(null, {
//       fieldName: file.fieldname,
//       mimeType: file.mimetype,
//     });
//   },
//   key: function (req, file, cb) {
//     const fileName = `holam/thumbnails/${Date.now()}_${path.basename(
//       file.originalname,
//       path.extname(file.originalname)
//     )}-thumbnail.png`;
//     cb(null, fileName);
//   },
// });

// const uploadThumbnailToS3 = multer({ storage: thumbnailStorage }).single(
//   "file"
// );

// module.exports = {
//   uploadAudioToS3,
//   uploadImageToS3,
//   uploadOtherToS3,
//   uploadVideoToS3,
//   uploadThumbnailToS3,
// };


const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const path = require("path");
const multerS3 = require("multer-s3");
const s3 = require("./s3");
require("dotenv").config();

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Fonction générique pour la configuration de stockage S3
const createMulterStorage = (folder) => {
  return multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    acl: "public-read", // Donne accès public aux fichiers
    metadata: (req, file, cb) => {
      cb(null, {
        fieldName: file.fieldname,
        mimeType: file.mimetype,
      });
    },
    key: (req, file, cb) => {
      const fileName = `${folder}/${Date.now()}_${path.basename(
        file.originalname
      )}`;
      cb(null, fileName);
    },
  });
};

// Création de stockages pour différents types de fichiers
const uploadImageToS3 = multer({
  storage: createMulterStorage("holam/images"),
});
const uploadVideoToS3 = multer({
  storage: createMulterStorage("holam/videos"),
});
const uploadAudioToS3 = multer({
  storage: createMulterStorage("holam/audios"),
});
const uploadOtherToS3 = multer({
  storage: createMulterStorage("holam/others"),
});

// Upload pour les thumbnails (miniatures)
const thumbnailStorage = multerS3({
  s3: s3,
  bucket: BUCKET_NAME,
  acl: "public-read",
  metadata: (req, file, cb) => {
    cb(null, {
      fieldName: file.fieldname,
      mimeType: file.mimetype,
    });
  },
  key: (req, file, cb) => {
    const thumbnailName = `holam/thumbnails/${Date.now()}_${path.basename(
      file.originalname,
      path.extname(file.originalname)
    )}-thumbnail.png`;
    cb(null, thumbnailName);
  },
});
const uploadThumbnailToS3 = multer({ storage: thumbnailStorage }).single(
  "file"
);

// Export des modules d'upload
module.exports = {
  uploadAudioToS3,
  uploadImageToS3,
  uploadOtherToS3,
  uploadVideoToS3,
  uploadThumbnailToS3,
};
