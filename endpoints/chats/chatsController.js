// const Chat = require("./chatsModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all chat
// // @Route: /api/v1/chats
// // @Access: Public
// exports.getAllChats = async (req, res, next) => {
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
//     const chats = await Chat.find(queryObj)
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(chats);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get chat by id
// // @Route: /api/v1/chats/:id
// // @Access: Public
// exports.getChatById = async (req, res) => {
//   try {
//     // get chat by id
//     const userIn = await req.userIn();
//     // get chat by id
//     let chatSearch = await Chat.find({
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
//       chatSearch = await Chat.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const chat = chatSearch[0];
//     if (!chat)
//       return res.status(404).json({
//         message: CustomUtils.consts.NOT_FOUND,
//       });
//     res.status(200).json(chat);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create new chat // @Route: /api/v1/chats
// // @Access: Private
// exports.createChat = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);
//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     // create new chat
//     const chat = await Chat.create(CustomBody);
//     res.status(201).json(chat);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update chat by id
// // @Route: /api/v1/chats/:id
// // @Access: Private
// exports.updateChat = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let chatSearch = await Chat.find({
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
//       chatSearch = await Chat.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const chat = chatSearch[0];
//     if (!chat) {
//       return res.status(404).json({ message: "chat not found !" });
//     }

//     const updated = await Chat.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     return res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Delete chat by id
// // @Route: /api/v1/chats/:id
// // @Access: Private
// exports.deleteChat = async (req, res, next) => {
//   try {
//     const userIn = await req.userIn();

//     let chatSearch = await Chat.find({
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
//       chatSearch = await Chat.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const chat = chatSearch[0];
//     if (!chat) return res.status(404).json({ message: `chat not found !` });
//     await Chat.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "chat deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const Chat = require("./chatsModel.js");
const CustomUtils = require("../../utils/index.js");
const Course = require("../courses/coursesModel.js");
const { default: mongoose } = require("mongoose");

// @Get all chats
// @Route: /api/v1/chats
// @Access: Public
exports.getAllChats = async (req, res) => {
  try {
    let {
      limit = 10,
      page = 1,
      sort = "-createdAt",
      fields,
      _from,
    } = req.query;
    limit = parseInt(limit, 10);
    let skip = null;
    if (_from) limit = null;
    const queryObj = CustomUtils.advancedQuery(req.query);
    const userIn = await req.userIn();

    // Restreindre les chats à l'utilisateur courant s'il n'est pas super admin ou admin
    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      queryObj.members = { $in: [userIn._id] };
    }

    console.log(queryObj);

    const chats = await Chat.find(queryObj)
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sort)
      .select(fields ? fields.split(",").join(" ") : "");

    res.status(200).json(chats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get chat by id
// @Route: /api/v1/chats/:id
// @Access: Public
exports.getChatById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const queryObj = { _id: req.params.id };

    // Restreindre l'accès au chat à l'utilisateur courant s'il n'est pas super admin ou admin
    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      queryObj.user = userIn._id;
    }

    const chat = await Chat.findOne(queryObj);
    if (!chat) {
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new chat
// @Route: /api/v1/chats
// @Access: Private
exports.createChat = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const chatData = { ...req.body, user: userIn._id };
    chatData.slug = CustomUtils.slugify(chatData.name);

    const chat = await Chat.create(chatData);
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update chat by id
// @Route: /api/v1/chats/:id
// @Access: Private
exports.updateChat = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const queryObj = { _id: req.params.id };

    // Restreindre l'accès au chat à l'utilisateur courant s'il n'est pas super admin ou admin
    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      queryObj.user = userIn._id;
      queryObj.members = { $in: [userIn._id] };
    }

    const chat = await Chat.findOneAndUpdate(queryObj, req.body, {
      new: true,
      runValidators: true,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Update chat by id
// @Route: /api/v1/chats/:id
// @Access: Private
// exports.addMemberLearnerToCourseChat = async (req, res) => {
//   try {
//     const userIn = await req.userIn();
//     const queryObj = {
//       _id: req.params.id,
//       members: {
//         $nin: req.body.user,
//       },
//     };

//     const chatFinded = await Chat.findOne(queryObj);

//     if (!chatFinded) {
//       return res
//         .status(404)
//         .json({ message: "Chat not found or user already in chat!" });
//     }

//     const courseFinded = await Course.findOne({
//       chat: chatFinded._id,
//       learners: {
//         $nin: req.body.user,
//       },
//     });

//     await Course.findOneAndUpdate(
//       {
//         chat: chatFinded._id,
//         learners: {
//           $nin: req.body.user,
//         },
//       },
//       {
//         learners: [...courseFinded.learners, req.body.user],
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     const chat = await Chat.findOneAndUpdate(
//       queryObj,
//       {
//         members: [...chatFinded.members, req.body.user],
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found!" });
//     }

//     res.status(200).json(chat);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.addMemberLearnerToCourseChat = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const userId = req.body.user;

    // Vérification de la présence de l'utilisateur
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing user ID." });
    }

    // Recherche du chat et vérification que l'utilisateur n'est pas déjà dans les membres
    const chatFinded = await Chat.findOne({
      _id: req.params.id,
      members: { $nin: [userId] }, // $nin vérifie que l'utilisateur n'est pas déjà membre
    });

    if (!chatFinded) {
      return res
        .status(404)
        .json({ message: "Chat not found or user already in chat!" });
    }

    // Recherche du cours associé au chat
    const courseFinded = await Course.findOne({
      chat: chatFinded._id,
      learners: { $nin: [userId] }, // $nin vérifie que l'utilisateur n'est pas déjà apprenant
    });

    if (!courseFinded) {
      return res
        .status(404)
        .json({ message: "Course not found or user already a learner!" });
    }

    // Mettre à jour le cours en ajoutant l'utilisateur dans les learners
    await Course.findByIdAndUpdate(
      courseFinded._id,
      { $addToSet: { learners: userId } }, // $addToSet ajoute uniquement si l'ID n'existe pas
      { new: true, runValidators: true }
    );

    // Mettre à jour le chat en ajoutant l'utilisateur dans les members
    const updatedChat = await Chat.findByIdAndUpdate(
      chatFinded._id,
      { $addToSet: { members: userId } }, // $addToSet évite les doublons
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Error adding user to chat and course:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.removeMemberLearnerToCourseChat = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const queryObj = {
      _id: req.params.id,
      members: {
        $in: req.body.user,
      },
    };

    // Restreindre l'accès au chat à l'utilisateur courant s'il n'est pas super admin ou admin
    // if (
    //   userIn.role.slug !== "super-administrateur" &&
    //   userIn.role.slug !== "admin"
    // ) {
    //   queryObj.user = userIn._id;
    //   queryObj.members = { $in: [userIn._id] };
    // }

    const chatFinded = await Chat.findOne(queryObj);

    if (!chatFinded) {
      return res
        .status(404)
        .json({ message: "Chat not found or user not in chat!" });
    }

    const courseFinded = await Course.findOne({
      chat: chatFinded._id,
      learners: {
        $in: [req.body.user],
      },
    });

    await Course.findOneAndUpdate(
      {
        chat: chatFinded._id,
        learners: {
          $in: req.body.user,
        },
      },
      {
        $pull: { learners: req.body.user },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    const chat = await Chat.findOneAndUpdate(
      queryObj,
      {
        $pull: { members: req.body.user },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete chat by id
// @Route: /api/v1/chats/:id
// @Access: Private
exports.deleteChat = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const queryObj = { _id: req.params.id };

    // Restreindre l'accès au chat à l'utilisateur courant s'il n'est pas super admin ou admin
    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      queryObj.user = userIn._id;
      queryObj.members = { $in: [userIn._id] };
    }

    const chat = await Chat.findOneAndDelete(queryObj);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    res.status(200).json({ message: "Chat deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
