// const Message = require("./messagesModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all message
// // @Route: /api/v1/messages
// // @Access: Public
// exports.getAllMessages = async (req, res, next) => {
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
//     const messages = await Message.find(queryObj)
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get message by id
// // @Route: /api/v1/messages/:id
// // @Access: Public
// exports.getMessageById = async (req, res) => {
//   try {
//     // get message by id
//     const userIn = await req.userIn();

//     let messageSearch = await Message.find({
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
//       messageSearch = await Message.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const message = messageSearch[0];
//     if (!message)
//       return res.status(404).json({
//         message: CustomUtils.consts.NOT_FOUND,
//       });
//     res.status(200).json(message);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create new message // @Route: /api/v1/messages
// // @Access: Private
// exports.createMessage = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     // create new message
//     const message = await Message.create(CustomBody);
//     res.status(201).json(message);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update message by id
// // @Route: /api/v1/messages/:id
// // @Access: Private
// exports.updateMessage = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let messageSearch = await Message.find({
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
//       messageSearch = await Message.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const message = messageSearch[0];
//     if (!message) {
//       return res.status(404).json({ message: "message not found !" });
//     }

//     const updated = await Message.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     return res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Delete message by id
// // @Route: /api/v1/messages/:id
// // @Access: Private
// exports.deleteMessage = async (req, res, next) => {
//   try {
//     const userIn = await req.userIn();

//     let messageSearch = await Message.find({
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
//       messageSearch = await Message.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const message = messageSearch[0];
//     if (!message)
//       return res.status(404).json({ message: `message not found !` });
//     await Message.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "message deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const Message = require("./messagesModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all messages
// @Route: /api/v1/messages
// @Access: Public
// exports.getAllMessages = async (req, res, next) => {
//   try {
//     let {
//       limit = 10,
//       page = 1,
//       sort = "-createdAt",
//       fields,
//       _from,
//     } = req.query;
//     limit = parseInt(limit, 10);
//     let skip = null;
//     if (_from) limit = null;
//     const queryObj = CustomUtils.advancedQuery(req.query);
//     const userIn = await req.userIn();

//     if (
//       !(
//         userIn.role.slug === "super-administrateur" ||
//         userIn.role.slug === "admin"
//       )
//     ) {
//       queryObj.user = userIn._id;
//     }

//     const messages = await Message.find(queryObj)
//       .limit(parseInt(limit))
//       .skip(skip)
//       .sort(sort)
//       .select(fields ? fields.split(",").join(" ") : "-__v");

//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(500).json({ status: "fail", message: error.message });
//   }
// };

exports.getAllMessages = async (req, res, next) => {
  try {
    // Extraction et paramétrage des variables à partir des paramètres de requête
    let {
      limit = 10,
      page = 1,
      sort = "-createdAt",
      fields,
      _from,
    } = req.query;

    // Conversion en entier de limit et page
    limit = parseInt(limit, 10);
    page = parseInt(page, 10);

    // Calcul du "skip" pour la pagination (sauter un nombre d'enregistrements)
    let skip = (page - 1) * limit;

    // Si le paramètre `_from` est présent, ignorer la limite et le skip (pas de pagination)
    if (_from) {
      limit = null;
      skip = null;
    }

    // Génération de l'objet de requête en fonction des filtres avancés
    const queryObj = CustomUtils.advancedQuery(req.query);

    // Récupération de l'utilisateur connecté
    const userIn = await req.userIn();

    // Si l'utilisateur n'est ni un administrateur ni un super-administrateur, filtrer par son ID
    if (
      !(
        userIn.role.slug === "super-administrateur" ||
        userIn.role.slug === "admin"
      )
    ) {
      queryObj.user = userIn._id;
    }

    // Requête pour récupérer les messages avec filtres, pagination et tri
    const messages = await Message.find(queryObj)
      .limit(limit) // Appliquer la limite si elle existe
      .skip(skip) // Sauter des résultats pour la pagination
      .sort(sort) // Appliquer le tri
      .select(fields ? fields.split(",").join(" ") : "-__v"); // Sélectionner des champs spécifiques

    // Réponse avec les messages récupérés
    res.status(200).json(messages);
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.getAllChatMessages = async (req, res, next) => {
  try {
    // Extraction et paramétrage des variables à partir des paramètres de requête
    let {
      limit = 10,
      page = 1,
      sort = "-createdAt",
      fields,
      _from,
    } = req.query;

    // Conversion en entier de limit et page
    limit = parseInt(limit, 10);
    page = parseInt(page, 10);

    // Calcul du "skip" pour la pagination (sauter un nombre d'enregistrements)
    let skip = (page - 1) * limit;

    // Si le paramètre `_from` est présent, ignorer la limite et le skip (pas de pagination)
    if (_from) {
      limit = null;
      skip = null;
    }

    // Génération de l'objet de requête en fonction des filtres avancés
    let queryObj = CustomUtils.advancedQuery(req.query);

    // Récupération de l'utilisateur connecté
    const userIn = await req.userIn();

    // Si l'utilisateur n'est ni un administrateur ni un super-administrateur, filtrer par son ID
    // if (
    //   !(
    //     userIn.role.slug === "super-administrateur" ||
    //     userIn.role.slug === "admin"
    //   )
    // ) {
    //   queryObj.user = userIn._id;
    // }

    const chatId = req.params.id;

    if (!chatId)
      return res
        .status(400)
        .json({ message: "You must precise a valid chat Id." });

    queryObj = {
      ...queryObj,
      chat: chatId,
    };

    // Requête pour récupérer les messages avec filtres, pagination et tri
    const messages = await Message.find(queryObj)
      .limit(limit) // Appliquer la limite si elle existe
      .skip(skip) // Sauter des résultats pour la pagination
      .sort(sort) // Appliquer le tri
      .select(fields ? fields.split(",").join(" ") : "-__v"); // Sélectionner des champs spécifiques

    // Réponse avec les messages récupérés
    res.status(200).json(messages);
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @Get message by id
// @Route: /api/v1/messages/:id
// @Access: Public
exports.getMessageById = async (req, res) => {
  try {
    const userIn = await req.userIn();

    let message = await Message.findOne({
      _id: req.params.id,
      ...(userIn.role.slug !== "super-administrateur" &&
        userIn.role.slug !== "admin" && { user: userIn._id }),
    });

    if (!message) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @Create new message
// @Route: /api/v1/messages
// @Access: Private
exports.createMessage = async (req, res) => {
  try {
    const CustomBody = { ...req.body };
    const userIn = await req.userIn();

    CustomBody.user = userIn._id;
    CustomBody.sender = userIn._id;

    const message = await Message.create(CustomBody);

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// @Update message by id
// @Route: /api/v1/messages/:id
// @Access: Private
exports.updateMessage = async (req, res) => {
  try {
    const userIn = await req.userIn();

    let message = await Message.findOne({
      _id: req.params.id,
      ...(userIn.role.slug !== "super-administrateur" &&
        userIn.role.slug !== "admin" && { user: userIn._id }),
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found!" });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.updateMessageReadBy = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const messages = req.body.messages;

    if (!messages.length)
      return res.status(400).json({ message: "No messages sent!" });

    for (const message of messages) {
      const element = array[i];
      await Message.findByIdAndUpdate(
        message,
        {
          $push: {
            readBy: userIn._id,
          },
        },
        {
          new: true,
        }
      );
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// exports.updateReadByBulk = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let message = await Message.findOne({
//       _id: req.params.id,
//       ...(userIn.role.slug !== "super-administrateur" &&
//         userIn.role.slug !== "admin" && { user: userIn._id }),
//     });

//     if (!message) {
//       return res.status(404).json({ message: "Message not found!" });
//     }

//     const updatedMessage = await Message.findByIdAndUpdate(
//       req.params.id,
//       {
//         readBy: [
//           ...
//         ]
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     res.status(200).json(updatedMessage);
//   } catch (error) {
//     res.status(500).json({ status: "fail", message: error.message });
//   }
// };

// @Delete message by id
// @Route: /api/v1/messages/:id
// @Access: Private
exports.deleteMessage = async (req, res) => {
  try {
    const userIn = await req.userIn();

    let message = await Message.findOne({
      _id: req.params.id,
      ...(userIn.role.slug !== "super-administrateur" &&
        userIn.role.slug !== "admin" && { user: userIn._id }),
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found!" });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Message deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
