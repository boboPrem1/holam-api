const router = require("express").Router({ mergeParams: true });
const {
  getAllApiKeys,
  getApiKeyById,
  createApiKey,
  updateApiKey,
  deleteApiKey,
} = require("./apiKeysController");

router.route("/").get(getAllApiKeys).post(createApiKey);

router
  .route("/:id")
  .get(getApiKeyById)
  .put(updateApiKey)
  .delete(deleteApiKey);

module.exports = router;
