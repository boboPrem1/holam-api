const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const path = require("path");
const multerS3 = require("multer-s3");
const s3 = require("./s3");
require("dotenv").config();

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const imageStorage = multerS3({
  s3: s3,
  bucket: BUCKET_NAME,
  object: "holam",
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, {
      fieldName: file.fieldname,
      mimeType: file.mimetype,
    });
  },
  key: function (req, file, cb) {
    cb(null, `images/${Date.now()}_${path.basename(file.originalname)}`);
  },
});

const uploadImageToS3 = multer({ storage: imageStorage });

const videoStorage = multerS3({
  s3: s3,
  bucket: BUCKET_NAME,
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, {
      fieldName: file.fieldname,
      mimeType: file.mimetype,
    });
  },
  key: function (req, file, cb) {
    cb(null, `holam/videos/${Date.now()}_${path.basename(file.originalname)}`);
  },
});

const uploadVideoToS3 = multer({ storage: videoStorage });

const audioStorage = multerS3({
  s3: s3,
  bucket: BUCKET_NAME,
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, {
      fieldName: file.fieldname,
      mimeType: file.mimetype,
    });
  },
  key: function (req, file, cb) {
    cb(null, `holam/audios/${Date.now()}_${path.basename(file.originalname)}`);
  },
});

const uploadAudioToS3 = multer({ storage: audioStorage });

const otherStorage = multerS3({
  s3: s3,
  bucket: BUCKET_NAME,
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, {
      fieldName: file.fieldname,
      mimeType: file.mimetype,
    });
  },
  key: function (req, file, cb) {
    cb(null, `holam/others/${Date.now()}_${path.basename(file.originalname)}`);
  },
});

const uploadOtherToS3 = multer({ storage: otherStorage });

// const uploadImageToS3 = async (file) => {
//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: `holam/images/${Date.now()}_${path.basename(file.originalname)}`,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   const command = new PutObjectCommand(params);
//   const result = await s3.send(command);
//   console.log(result.location);
//   return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
// };

// const uploadImageToS3 = async (file) => {
//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: `holam/images/${Date.now()}_${path.basename(file.originalname)}`,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   const command = new PutObjectCommand(params);
//   const result = await s3.send(command);
//   console.log(result.location);
//   return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
// };
// const uploadAudioToS3 = async (file) => {
//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: `holam/audios/${Date.now()}_${path.basename(file.originalname)}`,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   const command = new PutObjectCommand(params);
//   await s3.send(command);
//   return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
// };
// const uploadVideoToS3 = async (file) => {
//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: `holam/videos/${Date.now()}_${path.basename(file.originalname)}`,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   const command = new PutObjectCommand(params);
//   await s3.send(command);
//   return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
// };
// const uploadOtherToS3 = async (file) => {
//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: `holam/others/${Date.now()}_${path.basename(file.originalname)}`,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   const command = new PutObjectCommand(params);
//   await s3.send(command);
//   return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
// };

module.exports = {
  // upload,
  uploadAudioToS3,
  uploadImageToS3,
  uploadOtherToS3,
  uploadVideoToS3,
};

// const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: BUCKET_NAME,
//    cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, `holam/${Date.now().toString()}-${file.originalname}`);
//     },
//   }),
// });

// module.exports = upload;
