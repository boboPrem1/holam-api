const router = require("express").Router({ mergeParams: true });
const {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
} = require("./citiesController");

router.route("/").get(getAllCities).post(createCity);

router.route("/:id").get(getCityById).put(updateCity).delete(deleteCity);

module.exports = router;
