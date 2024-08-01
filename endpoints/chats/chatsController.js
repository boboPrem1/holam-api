const Chat = require("./chatsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all chat
// @Route: /api/v1/chats
// @Access: Public
exports.getAllChats = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const chats = await Chat.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
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
    // get chat by id
    const chat = await Chat.findById(req.params.id);
    if (!chat)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new chat // @Route: /api/v1/chats
// @Access: Private
exports.createChat = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);
  try {
    CustomBody.slug = slug;
    // create new chat     
    const chat = await Chat.create(CustomBody);
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
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: "chat not found !" });
    }

    const updated = await Chat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete chat by id
// @Route: /api/v1/chats/:id
// @Access: Private
exports.deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ message: `chat not found !` });
    await Chat.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "chat deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
