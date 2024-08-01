const Notification = require("./notificationsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all notification
// @Route: /api/v1/notifications
// @Access: Public
exports.getAllNotifications = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const notifications = await Notification.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get notification by id
// @Route: /api/v1/notifications/:id
// @Access: Public
exports.getNotificationById = async (req, res) => {
  try {
    // get notification by id
    const notification = await Notification.findById(req.params.id);
    if (!notification)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new notification // @Route: /api/v1/notifications
// @Access: Private
exports.createNotification = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);
  try {
    CustomBody.slug = slug;
    // create new notification     
    const notification = await Notification.create(CustomBody);
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update notification by id
// @Route: /api/v1/notifications/:id
// @Access: Private
exports.updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "notification not found !" });
    }

    const updated = await Notification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete notification by id
// @Route: /api/v1/notifications/:id
// @Access: Private
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: `notification not found !` });
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "notification deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
