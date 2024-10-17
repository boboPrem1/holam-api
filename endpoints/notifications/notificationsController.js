// const Notification = require("./notificationsModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all notification
// // @Route: /api/v1/notifications
// // @Access: Public
// exports.getAllNotifications = async (req, res, next) => {
//   let { limit, page, sort, fields, _from } = req.query;
//   const queryObj = CustomUtils.advancedQuery(req.query);
//   const userIn = await req.userIn();
//   if (
//     !userIn.role.slug == "super-administrateur" ||
//     !userIn.role.slug == "admin"
//   ) {
//     queryObj.user = userIn._id;
//   }
//   try {
//     const notifications = await Notification.find(queryObj)
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(notifications);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get notification by id
// // @Route: /api/v1/notifications/:id
// // @Access: Public
// exports.getNotificationById = async (req, res) => {
//   try {
//     // get notification by id
//     const userIn = await req.userIn();

//     let notificationSearch = await Notification.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       user: {
//         $eq: userIn._id,
//       },
//     });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       notificationSearch = await Notification.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const notification = notificationSearch[0];
//     if (!notification)
//       return res.status(404).json({
//         message: CustomUtils.consts.NOT_FOUND,
//       });
//     res.status(200).json(notification);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create new notification // @Route: /api/v1/notifications
// // @Access: Private
// exports.createNotification = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     // create new notification
//     const notification = await Notification.create(CustomBody);
//     res.status(201).json(notification);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update notification by id
// // @Route: /api/v1/notifications/:id
// // @Access: Private
// exports.updateNotification = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let notificationSearch = await Notification.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       user: {
//         $eq: userIn._id,
//       },
//     });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       notificationSearch = await Notification.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const notification = notificationSearch[0];
//     if (!notification) {
//       return res.status(404).json({ message: "notification not found !" });
//     }

//     const updated = await Notification.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//       }
//     );
//     return res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Delete notification by id
// // @Route: /api/v1/notifications/:id
// // @Access: Private
// exports.deleteNotification = async (req, res, next) => {
//   try {
//     const userIn = await req.userIn();

//     let notificationSearch = await Notification.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       user: {
//         $eq: userIn._id,
//       },
//     });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       notificationSearch = await Notification.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const notification = notificationSearch[0];
//     if (!notification)
//       return res.status(404).json({ message: `notification not found !` });
//     await Notification.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "notification deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const Notification = require("./notificationsModel.js");
const CustomUtils = require("../../utils/index.js");
const { messaging } = require("firebase-admin");

require("dotenv").config();

const FIREBASE_REGISTRATION_TOKEN = process.env.FIREBASE_REGISTRATION_TOKEN;
// @Get all notifications
// @Route: /api/v1/notifications
// @Access: Public
exports.getAllNotifications = async (req, res, next) => {
  let { limit = 10, page = 1, sort, fields, _from } = req.query;
  limit = parseInt(limit, 10);
  let skip = null;
  if (_from) limit = null;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();

  // Correction de la condition sur les rôles
  if (
    userIn.role.slug !== "super-administrateur" &&
    userIn.role.slug !== "admin"
  ) {
    queryObj.user = userIn._id;
  }

  try {
    const notifications = await Notification.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort({
        createdAt: -1,
        ...(sort ? { ...sort } : {}),
      })
      .select(fields ? fields.split(",").join(" ") : "");

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Get notification by id
// @Route: /api/v1/notifications/:id
// @Access: Public
exports.getNotificationById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    let query = { _id: req.params.id, user: userIn._id };

    // Si l'utilisateur est admin ou super-admin, ne pas filtrer par user
    if (
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin"
    ) {
      query = { _id: req.params.id };
    }

    const notification = await Notification.findOne(query);

    if (!notification) {
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new notification
// @Route: /api/v1/notifications
// @Access: Private
exports.createNotification = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);
  const userIn = await req.userIn();

  CustomBody.user = userIn._id;
  CustomBody.slug = slug;

  if (!userIn.firebase_registration_token) {
    console.log({
      message: "Firebase registration token not set",
    });
  }
  
  try {
    const notification = await Notification.create(CustomBody);
    // Start firebase sending

    const message = {
      data: {
        message: CustomBody.description,
      },
      token: userIn.firebase_registration_token,
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
    // End firebase sending
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.sendMulticastNotification = async (req, res) => {
  try {
    // Create a list containing up to 500 registration tokens.
    // These registration tokens come from the client FCM SDKs.
    const registrationTokens = [
      "YOUR_REGISTRATION_TOKEN_1",
      // …
      "YOUR_REGISTRATION_TOKEN_N",
    ];

    const message = {
      data: { score: "850", time: "2:45" },
      tokens: registrationTokens,
    };

    messaging()
      .sendMulticast(message)
      .then((response) => {
        console.log(response.successCount + " messages were sent successfully");
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.sendNotificationToAndroid = async (req, res) => {
  try {
    const topicName = "industry-tech";

    const message = {
      notification: {
        title: "`$FooCorp` up 1.43% on the day",
        body: "FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.",
      },
      android: {
        notification: {
          icon: "stock_ticker_update",
          color: "#7e55c3",
        },
      },
      topic: topicName,
    };

    messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.sendNotificationToIos = async (req, res) => {
  try {
    const { topicName, title, imageSrc: image } = req.body;

    const message = {
      notification: {
        title,
      },
      apns: {
        payload: {
          aps: {
            "mutable-content": 1,
          },
        },
        fcm_options: {
          image,
        },
      },
      topic: topicName,
    };

    messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update notification by id
// @Route: /api/v1/notifications/:id
// @Access: Private
exports.updateNotification = async (req, res) => {
  try {
    const userIn = await req.userIn();
    let query = { _id: req.params.id, user: userIn._id };

    if (
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin"
    ) {
      query = { _id: req.params.id };
    }

    const notification = await Notification.findOne(query);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found!" });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete notification by id
// @Route: /api/v1/notifications/:id
// @Access: Private
exports.deleteNotification = async (req, res) => {
  try {
    const userIn = await req.userIn();
    let query = { _id: req.params.id, user: userIn._id };

    if (
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin"
    ) {
      query = { _id: req.params.id };
    }

    const notification = await Notification.findOne(query);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found!" });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Notification deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
