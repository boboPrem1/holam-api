const router = require("express").Router({ mergeParams: true });
const {
  getAllFavouritesCities,
  createFavouriteCity,
  getFavouriteCityById,
  updateFavouriteCity,
  deleteFavouriteCity,
} = require("./favouritesCitiesController");

router.route("/").get(getAllFavouritesCities).post(createFavouriteCity);

router.route("/:id").get(getFavouriteCityById).put(updateFavouriteCity).delete(deleteFavouriteCity);

module.exports = router;
