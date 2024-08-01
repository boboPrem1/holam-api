const Message = require("./messagesModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all message
// @Route: /api/v1/messages
// @Access: Public
exports.getAllMessages = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const messages = await Message.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get message by id
// @Route: /api/v1/messages/:id
// @Access: Public
exports.getMessageById = async (req, res) => {
  try {
    // get message by id
    const message = await Message.findById(req.params.id);
    if (!message)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new message // @Route: /api/v1/messages
// @Access: Private
exports.createMessage = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);
  try {
    CustomBody.slug = slug;
    // create new message
    const message = await Message.create(CustomBody);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update message by id
// @Route: /api/v1/messages/:id
// @Access: Private
exports.updateMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "message not found !" });
    }

    const updated = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete message by id
// @Route: /api/v1/messages/:id
// @Access: Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: `message not found !` });
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "message deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
