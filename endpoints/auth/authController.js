const User = require("../users/userModel");
const UserRole = require("../userRoles/userRoleModel");
const ApiKey = require("../apiKeys/apiKeysModel");
const jwt = require("jsonwebtoken");
const CustomUtils = require("../../utils/index.js");
const Otp = require("../otps/otpsModel.js");
const bcrypt = require("bcryptjs");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
require("dotenv").config();

// const s3 = new S3Client({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

const APP_NAME = process.env.APP_NAME;
const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Hash password universal function
async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

function signToken(user) {
  return jwt.sign({ data: user._id }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
}

function isObjectNotEmpty(obj) {
  return obj && Object.keys(obj).length > 0;
}

exports.sign = async (req, res, next) => {
  // console.log(req.body);
  const { indicatif, number } = req.body;
  let newUser;
  let otp;
  const existingUser = await User.find({
    "phone.indicatif": { $eq: indicatif },
    "phone.number": { $eq: number },
  });
  if (existingUser.length > 0) {
    res.status(200).json({ existing: true });
  } else {
    const role = await UserRole.find({
      slug: { $eq: "user" },
    });
    newUser = await User.create({
      phone: { indicatif: indicatif, number: number },
      role: role[0]._id,
      username: CustomUtils.generateUsername(),
    });
    let randomNumber = CustomUtils.getRandomNbr();
    let existingOtp = await Otp.find({
      otp: { $eq: randomNumber },
    });
    const beginningDate = new Date();
    const endingDate = new Date(beginningDate);
    endingDate.setDate(beginningDate.getDate() + 10);

    while (existingOtp.length) {
      randomNumber = CustomUtils.getRandomNbr();
      existingOtp = await Otp.find({
        otp: { $eq: randomNumber },
      });
    }
    otp = await Otp.create({
      user: newUser._id,
      otp: randomNumber,
      exp: endingDate,
    });

    const params = {
      Message: `Your OTP is: ${otp.otp}`,
      PhoneNumber: indicatif + "" + number,
      MessageAttributes: {
        "AWS.SNS.SMS.SenderID": {
          DataType: "String",
          StringValue: APP_NAME, // Remplacez par le nom de votre application
        },
      },
    };

    try {
      const data = await snsClient.send(new PublishCommand(params));
      // res.status(200).json({ message: "OTP sent successfully", data });
    } catch (error) {
      res.status(500).json({ message: "Failed to send OTP", error });
    }

    // res.status(201).json(otp);
    res.status(200).json({
      existing: false,
      created: true,
      otpSended: true,
    });
    // console.log(otp.otp);
  }
};

exports.verifyOtp = async (req, res, next) => {
  const { body } = req;
  const otp = await Otp.find({ otp: { $eq: body.otp } });
  // console.log(body);
  if (otp.length) {
    let otpFound = otp[0];
    if (otpFound.exp < Date.now()) {
      otpFound = await Otp.findByIdAndUpdate(
        otpFound._id,
        { status: "expired" },
        { new: true }
      );
    } else {
      otpFound = await Otp.findByIdAndUpdate(
        otpFound._id,
        { attempt: otpFound.attempt + 1, status: "used" },
        { new: true }
      );
    }

    return res.status(200).json({
      existing: true,
      status: otpFound.status,
      attempt: otpFound.attempt + 1,
    });
  } else {
    res.status(404).json({ existing: false });
  }
};

exports.signup = async (req, res, next) => {
  try {
    const bodyWR = { ...req.body };

    const role = await UserRole.find({ slug: "user" });
    if (role.length) bodyWR.role = role[0]._id;
    // look if email exist
    if (bodyWR.email) {
      const existingEmail = await User.find({
        email: bodyWR.email,
      });
      if (existingEmail.length)
        return res
          .status(400)
          .json({ message: CustomUtils.consts.EXISTING_ACCOUNT });
    }

    // Generate a random four digit number
    let usernameExist = true;
    while (usernameExist) {
      bodyWR.username = CustomUtils.generateUsername();
      const existingUser = await User.find({ username: bodyWR.username });
      if (!existingUser.length) {
        usernameExist = false;
      }
    }
    const slug = CustomUtils.slugify(bodyWR.username);
    bodyWR.slug = slug;
    bodyWR.complete_name = `${bodyWR.lastname ? bodyWR.lastname + " " : ""}${
      bodyWR.firstname ? bodyWR.firstname : ""
    }`;
    const newUser = await User.create(bodyWR);
    await User.findByIdAndUpdate(newUser._id, { password: req.body.password });
    newUser.role = role[0];
    const token = signToken(newUser);

    res.status(201).json({
      status: "success",
      token,
      data: { user: newUser },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setPassword = async (req, res, next) => {
  const { indicatif, number, password } = req.body;

  const existingUser = await User.find({
    "phone.indicatif": { $eq: indicatif },
    "phone.number": { $eq: number },
  });
  if (existingUser.length) {
    const user = existingUser[0];
    const hashedPassword = hashPassword(password);
    await User.findByIdAndUpdate(user._id, { password }, { new: true });
  }
  // console.log(existingUser);
  return res.status(200).json({ success: true });
  // const user = await User.find();
};

exports.signinWithTel = async (req, res, next) => {
  try {
    let token = "";
    // Test if email and password exist
    const { indicatif, number, password } = req.body;
    if (!indicatif || !number || !password)
      return res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });

    // Test if user exists && password is correct
    const user = await User.findOne({
      "phone.indicatif": { $eq: indicatif },
      "phone.number": { $eq: number },
    }).select("+password");
    //console.log(user);

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: CustomUtils.consts.UNAUTHORIZED });
    } else {
      // If everything ok, send token to client
      // req.user = user;
      // console.log(req.user);
      token = signToken(user);
    }

    // console.log(req.user);

    res.status(200).json({ status: "success", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.signinWithTelOtp = async (req, res, next) => {
  try {
    let token = "";
    // Test if email and password exist
    const { indicatif, number, otp } = req.body;
    if (!indicatif || !number || !password)
      return res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });

    // Test if user exists && password is correct
    const user = await User.findOne({
      "phone.indicatif": { $eq: indicatif },
      "phone.number": { $eq: number },
    });

    const result = await Otp.find({ otp: { $eq: otp } });
    if (result.length) {
      const otpFound = result[0];

      if (!user || !otpFound) {
        return res
          .status(401)
          .json({ message: CustomUtils.consts.UNAUTHORIZED });
      } else if (otpFound.exp < Date.now()) {
        return res
          .status(401)
          .json({ message: CustomUtils.consts.EXPIRED_OTP });
      } else {
        // If everything ok, send token to client
        // req.user = user;
        // console.log(req.user);
        token = signToken(user);
      }
    }
    //console.log(user);

    // console.log(req.user);

    res.status(200).json({ status: "success", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.signin = async (req, res, next) => {
  // console.log(req.body);
  res.status(200).json({ success: true });
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    let way;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      way = "jwt";
      // console.log("token found", token);
    }
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("ApiKey")
    ) {
      token = req.headers.authorization.split(" ")[1];
      way = "api_key";
    }

    // console.log("token found", token);

    if (!token) {
      return res.status(401).json({
        message: CustomUtils.consts.NOT_LOGGED_IN,
      });
      // return next();
    }

    let decoded;
    let currentUser;
    let currentKey;

    switch (way) {
      case "jwt":
        // 2) Verification token
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 3) Check if user still exists
        currentUser = await User.findById(decoded.data);
        break;
      case "api_key":
        // 2) Verification token
        currentKey = await ApiKey.find({
          key: { $eq: token },
        });
        // console.log(
        //   await ApiKey.find({
        //     key: token,
        //   })
        // );
        // console.log(currentKey);
        if (!currentKey.length) {
          return res.status(401).json({
            message: CustomUtils.consts.UNAUTHORIZED,
          });
        }
        // 3) Check if user still exists
        // currentApiKey = await User.findById(decoded.user.id);
        break;
    }

    // console.log(currentUser);

    if (!currentUser && !currentKey) {
      // console.log("hier");
      return res.status(401).json({
        message: CustomUtils.consts.UNAUTHORIZED,
      });
      // return next();
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    req.userIn = async () => {
      const userIn = await User.findById(req.user);
      return userIn;
    };
    // console.log(req);
    // console.log("token found", currentKey);
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //console.log(req.user);
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: CustomUtils.consts.UNAUTHORIZED,
      });
    }

    next();
  };
};
