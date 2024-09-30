const CustomUtils = require("../../utils");
const Video = require("./videosModel");

const router = require("express").Router({ mergeParams: true });

router.route("/").get(async (req, res, next) => {
  let { limit, page, sort, fields, _from } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const videos = await Video.find(queryObj)
      .limit(limit)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(videos);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
