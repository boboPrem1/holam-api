// const FavouriteCity = require("./favouriteCitiesModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all favouriteCities types
// // @Route: /api/v1/favouriteCities
// // @Access: Public
// exports.getAllCities = async (req, res, next) => {
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
//     const favouriteCities = await FavouriteCity.find(queryObj)
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(favouriteCities);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get favouriteCity type by id
// // @Route: /api/v1/favouriteCities/:id
// // @Access: Public
// exports.getFavouriteCityById = async (req, res) => {
//   try {
//     // get favouriteCity type by id
//     const userIn = await req.userIn();

//     let favouriteCitySearch = await FavouriteCity.find({
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
//       favouriteCitySearch = await FavouriteCity.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const favouriteCity = favouriteCitySearch[0];
//     if (!favouriteCity)
//       return res.status(404).json({
//         message: CustomUtils.consts.NOT_FOUND,
//       });
//     res.status(200).json(favouriteCity);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create new favouriteCity type
// // @Route: /api/v1/favouriteCities
// // @Access: Private
// exports.createFavouriteCity = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);
//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     // create new favouriteCity type
//     const favouriteCity = await FavouriteCity.create(CustomBody);
//     res.status(201).json(favouriteCity);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update favouriteCity type by id
// // @Route: /api/v1/favouriteCities/:id
// // @Access: Private
// exports.updateFavouriteCity = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let favouriteCitySearch = await FavouriteCity.find({
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
//       favouriteCitySearch = await FavouriteCity.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const favouriteCity = favouriteCitySearch[0];
//     if (!favouriteCity) {
//       return res.status(404).json({ message: "favouriteCity not found !" });
//     }

//     const updated = await FavouriteCity.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     return res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Delete favouriteCity type by id
// // @Route: /api/v1/favouriteCities/:id
// // @Access: Private
// exports.deleteFavouriteCity = async (req, res, next) => {
//   try {
//     const userIn = await req.userIn();

//     let favouriteCitySearch = await FavouriteCity.find({
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
//       favouriteCitySearch = await FavouriteCity.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const favouriteCity = favouriteCitySearch[0];
//     if (!favouriteCity) return res.status(404).json({ message: `favouriteCity not found !` });
//     await FavouriteCity.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "favouriteCity deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const FavouriteCity = require("./favouritesCitiesModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all favouriteCities
// @Route: /api/v1/favouriteCities
// @Access: Public
exports.getAllFavouritesCities = async (req, res, next) => {
  try {
    let { limit = 10, page = 1, sort, fields, _from } = req.query;
    limit = parseInt(limit, 10);
    let skip = null;
    if (_from) limit = null;
    const queryObj = CustomUtils.advancedQuery(req.query);
    const userIn = await req.userIn();

    // Restrict query to user's favouriteCities if not a super admin or admin
    if (!["super-administrateur", "admin"].includes(userIn.role.slug)) {
      queryObj.user = userIn._id;
    }

    const favouriteCities = await FavouriteCity.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1, ...sort })
      .select(fields ? fields.split(",").join(" ") : "");

    res.status(200).json(favouriteCities);
  } catch (error) {
    next(error); // Improved error handling
  }
};

// @Get favouriteCity by ID
// @Route: /api/v1/favouriteCities/:id
// @Access: Public
exports.getFavouriteCityById = async (req, res, next) => {
  try {
    const userIn = await req.userIn();

    const query = {
      _id: req.params.id,
      ...(userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
        ? { user: userIn._id }
        : {}),
    };

    const favouriteCity = await FavouriteCity.findOne(query);
    if (!favouriteCity) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    res.status(200).json(favouriteCity);
  } catch (error) {
    next(error); // Improved error handling
  }
};

// @Create new favouriteCity
// @Route: /api/v1/favouriteCities
// @Access: Private
exports.createFavouriteCity = async (req, res, next) => {
  try {
    const userIn = await req.userIn();
    const slug = CustomUtils.slugify(req.body.name);

    const newFavouriteCity = new FavouriteCity({
      ...req.body,
      slug,
      user: userIn._id,
    });

    const favouriteCity = await newFavouriteCity.save();
    res.status(201).json(favouriteCity);
  } catch (error) {
    next(error); // Improved error handling
  }
};

// @Update favouriteCity by ID
// @Route: /api/v1/favouriteCities/:id
// @Access: Private
exports.updateFavouriteCity = async (req, res, next) => {
  try {
    const userIn = await req.userIn();

    const query = {
      _id: req.params.id,
      ...(userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
        ? { user: userIn._id }
        : {}),
    };

    const favouriteCity = await FavouriteCity.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });

    if (!favouriteCity) {
      return res.status(404).json({ message: "FavouriteCity not found!" });
    }

    res.status(200).json(favouriteCity);
  } catch (error) {
    next(error); // Improved error handling
  }
};

// @Delete favouriteCity by ID
// @Route: /api/v1/favouriteCities/:id
// @Access: Private
exports.deleteFavouriteCity = async (req, res, next) => {
  try {
    const userIn = await req.userIn();

    const query = {
      _id: req.params.id,
      ...(userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
        ? { user: userIn._id }
        : {}),
    };

    const favouriteCity = await FavouriteCity.findOneAndDelete(query);

    if (!favouriteCity) {
      return res.status(404).json({ message: "FavouriteCity not found!" });
    }

    res.status(200).json({ message: "FavouriteCity deleted successfully!" });
  } catch (error) {
    next(error); // Improved error handling
  }
};
