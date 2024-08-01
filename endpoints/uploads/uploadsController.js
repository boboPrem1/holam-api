// const { S3 } = require("@aws-sdk/client-s3");
// const multer = require("multer");
// const multerS3 = require("multer-s3");

// const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
// const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
// const BUCKET_NAME = process.env.BUCKET_NAME;
// const AWS_REGION = process.env.AWS_REGION;

// S3 config
// const s3 = new S3({
//   accessKeyId: ACCESS_KEY_ID,
//   secretAccessKey: SECRET_ACCESS_KEY,
//   region: AWS_REGION,
//   credentials: {
//     accessKeyId: ACCESS_KEY_ID,
//     secretAccessKey: SECRET_ACCESS_KEY,
//   },
// });

// const storage = multerS3({
//   s3: s3,
//   bucket: BUCKET_NAME,
//   acl: "public-read",
//   metadata: function (req, file, cb) {
//     cb(null, { fieldName: file.fieldname });
//   },
//   key: function (req, file, cb) {
//     cb(null, "users/images/" + Date.now().toString() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "YOUR_S3_BUCKET_NAME",
//     acl: "public-read",
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString() + "-" + file.originalname);
//     },
//   }),
// });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `public/uploads/images/`);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = file.mimetype.split("/")[1];
//     console.log(ext);
//     cb(null, file.fieldname + "-" + uniqueSuffix + "." + ext);
//   },
// });

// const upload = multer({ storage: storage });

// module.exports.UploadImage = upload;
