const router = require("express").Router({ mergeParams: true });
const {
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
} = require("./countriesController");

router.route("/").get(getAllCountries).post(createCountry);

router
  .route("/:id")
  .get(getCountryById)
  .put(updateCountry)
  .delete(deleteCountry);

module.exports = router;
