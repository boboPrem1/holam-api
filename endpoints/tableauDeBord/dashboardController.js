const CustomUtils = require("../../utils/index.js");
const Activity = require("../activities/activitiesModel.js");
const ActivityCategory = require("../activityCategories/activityCategoriesModel.js");
const ActivitySubCategory = require("../activitySubCategories/activitySubCategoriesModel.js");
const ApiKey = require("../apiKeys/apiKeysModel.js");
const Otp = require("../otps/otpsModel.js");
const Permission = require("../permissions/permissionsModel.js");
const UserRole = require("../userRoles/userRoleModel.js");
const User = require("../users/userModel.js");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const Video = require("../videos/videosModel.js");
const Course = require("../courses/coursesModel.js");
const City = require("../cities/citiesModel.js");
const Country = require("../countries/countriesModel.js");
const GeolocationService = require("../geolocationServices/geolocationServicesModel.js");
const GeolocationServiceMaster = require("../geolocationServiceMasters/geolocationServiceMastersModel.js");
const GeolocationServiceAgent = require("../geolocationServiceAgents/geolocationServiceAgentsModel.js");
const GeolocationServiceClient = require("../geolocationServiceClients/geolocationServicesClientsModel.js");
const GeolocationServiceTransaction = require("../geolocationServiceTransactions/geolocationServiceTransactionsModel.js");
const GeolocationServicePoint = require("../geolocationServicePoints/geolocationServicePointsModel.js");
const Monitoring = require("../monitorings/monitoringsModel.js");

const startOfYear = moment().startOf("year").toDate();
const startOfMonth = moment().startOf("month").toDate();
const startOfWeek = moment().startOf("week").toDate();
const startOfDay = moment().startOf("day").toDate();

const now = new Date();

// @Get me
// @route GET /api/v1/users/me
// @access Private
exports.getAllTotaux = async (req, res) => {
  try {
    // users
    const allUsers = await User.find().count();

    const lastYearUsers = await User.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthUsers = await User.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekUsers = await User.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayUsers = await User.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // Otps
    const allOtps = await Otp.find().count();

    const lastYearOtps = await Otp.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthOtps = await Otp.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekOtps = await Otp.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayOtps = await Otp.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // UserRoles
    const allUserRoles = await UserRole.find().count();

    const lastYearUserRoles = await UserRole.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthUserRoles = await UserRole.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekUserRoles = await UserRole.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayUserRoles = await UserRole.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // Permissions
    const allPermissions = await Permission.find().count();

    const lastYearPermissions = await Permission.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthPermissions = await Permission.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekPermissions = await Permission.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayPermissions = await Permission.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // ApiKeys
    const allApiKeys = await ApiKey.find().count();

    const lastYearApiKeys = await ApiKey.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthApiKeys = await ApiKey.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekApiKeys = await ApiKey.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayApiKeys = await ApiKey.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // SigActivities
    const allSigActivities = await Activity.find({
      type: {
        $eq: "reporting"
      }
    }).count();

    const lastYearSigActivities = await Activity.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },type: {
        $eq: "reporting"
      }
    }).count();

    const lastMonthSigActivities = await Activity.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },type: {
        $eq: "reporting"
      }
    }).count();

    const lastWeekSigActivities = await Activity.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },type: {
        $eq: "reporting"
      }
    }).count();

    const lastDaySigActivities = await Activity.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },type: {
        $eq: "reporting"
      }
    }).count();

    // SugActivities
    const allSugActivities = await Activity.find({
      type: {
        $eq: "suggestion"
      }
    }).count();

    const lastYearSugActivities = await Activity.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },type: {
        $eq: "suggestion"
      }
    }).count();

    const lastMonthSugActivities = await Activity.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },type: {
        $eq: "suggestion"
      }
    }).count();

    const lastWeekSugActivities = await Activity.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },type: {
        $eq: "suggestion"
      }
    }).count();

    const lastDaySugActivities = await Activity.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },type: {
        $eq: "suggestion"
      }
    }).count();

    // ActivityCategories
    const allActivityCategories = await ActivityCategory.find().count();

    const lastYearActivityCategories = await ActivityCategory.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthActivityCategories = await ActivityCategory.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekActivityCategories = await ActivityCategory.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayActivityCategories = await ActivityCategory.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // ActivitySubCategories
    const allActivitySubCategories = await ActivitySubCategory.find().count();

    const lastYearActivitySubCategories = await ActivitySubCategory.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthActivitySubCategories = await ActivitySubCategory.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekActivitySubCategories = await ActivitySubCategory.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayActivitySubCategories = await ActivitySubCategory.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // ApiKeys
    const allVideos = await Video.find().count();

    const lastYearVideos = await Video.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthVideos = await Video.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekVideos = await Video.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayVideos = await Video.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // Courses
    const allCourses = await Course.find().count();

    const lastYearCourses = await Course.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthCourses = await Course.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekCourses = await Course.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayCourses = await Course.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // Countries
    const allCountries = await Country.find().count();

    const lastYearCountries = await Country.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthCountries = await Country.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekCountries = await Country.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayCountries = await Country.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // Cities
    const allCities = await City.find().count();

    const lastYearCities = await City.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthCities = await City.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekCities = await City.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayCities = await City.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // Services
    const allServices = await GeolocationService.find().count();

    const lastYearServices = await GeolocationService.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthServices = await GeolocationService.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekServices = await GeolocationService.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayServices = await GeolocationService.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // Masters
    const allMasters = await GeolocationServiceMaster.find().count();

    const lastYearMasters = await GeolocationServiceMaster.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthMasters = await GeolocationServiceMaster.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekMasters = await GeolocationServiceMaster.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayMasters = await GeolocationServiceMaster.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // Agents
    const allAgents = await GeolocationServiceAgent.find().count();

    const lastYearAgents = await GeolocationServiceAgent.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthAgents = await GeolocationServiceAgent.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekAgents = await GeolocationServiceAgent.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayAgents = await GeolocationServiceAgent.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // Clients
    const allClients = await GeolocationServiceClient.find().count();

    const lastYearClients = await GeolocationServiceClient.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthClients = await GeolocationServiceClient.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekClients = await GeolocationServiceClient.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayClients = await GeolocationServiceClient.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // GeoTransactions
    const allGeoTransactions = await GeolocationServiceTransaction.find().count();

    const lastYearGeoTransactions = await GeolocationServiceTransaction.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    }).count();

    const lastMonthGeoTransactions = await GeolocationServiceTransaction.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }).count();

    const lastWeekGeoTransactions = await GeolocationServiceTransaction.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    }).count();

    const lastDayGeoTransactions = await GeolocationServiceTransaction.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    }).count();

    // Points
    const allPoints = await GeolocationServicePoint.find();
    const allPointsLength = allPoints.length;

    const lastYearPoints = await GeolocationServicePoint.find({
      createdAt: {
        $gte: startOfYear,
        $lte: now,
      },
    });
    const lastYearPointsLength = lastYearPoints.length;

    const lastMonthPoints = await GeolocationServicePoint.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    });
    const lastMonthPointsLength = lastMonthPoints.length;

    const lastWeekPoints = await GeolocationServicePoint.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: now,
      },
    });
    const lastWeekPointsLength = lastWeekPoints.length;

    const lastDayPoints = await GeolocationServicePoint.find({
      createdAt: {
        $gte: startOfDay,
        $lte: now,
      },
    });
    const lastDayPointsLength = lastDayPoints.length;
    
    const monitorings = await Monitoring.find();

    res.status(200).json({
      user: req.user,
      users: {
        all: allUsers,
        year: lastYearUsers,
        month: lastMonthUsers,
        week: lastWeekUsers,
        day: lastDayUsers,
      },
      otps: {
        all: allOtps,
        year: lastYearOtps,
        month: lastMonthOtps,
        week: lastWeekOtps,
        day: lastDayOtps,
      },
      userRoles: {
        all: allUserRoles,
        year: lastYearUserRoles,
        month: lastMonthUserRoles,
        week: lastWeekUserRoles,
        day: lastDayUserRoles,
      },
      permissions: {
        all: allPermissions,
        year: lastYearPermissions,
        month: lastMonthPermissions,
        week: lastWeekPermissions,
        day: lastDayPermissions,
      },
      apiKeys: {
        all: allApiKeys,
        year: lastYearApiKeys,
        month: lastMonthApiKeys,
        week: lastWeekApiKeys,
        day: lastDayApiKeys,
      },
      sigActivities: {
        all: allSigActivities,
        year: lastYearSigActivities,
        month: lastMonthSigActivities,
        week: lastWeekSigActivities,
        day: lastDaySigActivities,
      },
      sugActivities: {
        all: allSugActivities,
        year: lastYearSugActivities,
        month: lastMonthSugActivities,
        week: lastWeekSugActivities,
        day: lastDaySugActivities,
      },
      activityCategories: {
        all: allActivityCategories,
        year: lastYearActivityCategories,
        month: lastMonthActivityCategories,
        week: lastWeekActivityCategories,
        day: lastDayActivityCategories,
      },
      activitySubCategories: {
        all: allActivitySubCategories,
        year: lastYearActivitySubCategories,
        month: lastMonthActivitySubCategories,
        week: lastWeekActivitySubCategories,
        day: lastDayActivitySubCategories,
      },
      videos: {
        all: allVideos,
        year: lastYearVideos,
        month: lastMonthVideos,
        week: lastWeekVideos,
        day: lastDayVideos,
      },
      courses: {
        all: allCourses,
        year: lastYearCourses,
        month: lastMonthCourses,
        week: lastWeekCourses,
        day: lastDayCourses,
      },
      countries: {
        all: allCountries,
        year: lastYearCountries,
        month: lastMonthCountries,
        week: lastWeekCountries,
        day: lastDayCountries,
      },
      cities: {
        all: allCities,
        year: lastYearCities,
        month: lastMonthCities,
        week: lastWeekCities,
        day: lastDayCities,
      },
      services: {
        all: allServices,
        year: lastYearServices,
        month: lastMonthServices,
        week: lastWeekServices,
        day: lastDayServices,
      },
      masters: {
        all: allMasters,
        year: lastYearMasters,
        month: lastMonthMasters,
        week: lastWeekMasters,
        day: lastDayMasters,
      },
      agents: {
        all: allAgents,
        year: lastYearAgents,
        month: lastMonthAgents,
        week: lastWeekAgents,
        day: lastDayAgents,
      },
      clients: {
        all: allClients,
        year: lastYearClients,
        month: lastMonthClients,
        week: lastWeekClients,
        day: lastDayClients,
      },
      geoTransactions: {
        all: allGeoTransactions,
        year: lastYearGeoTransactions,
        month: lastMonthGeoTransactions,
        week: lastWeekGeoTransactions,
        day: lastDayGeoTransactions,
      },
      points: {
        all: {
          data: allPoints,
          length: allPointsLength
        },
        year: {
          data: lastYearPoints,
          length: lastYearPointsLength
        },
        month: {
          data: lastMonthPoints,
          length: lastMonthPointsLength
        },
        week: {
          data: lastWeekPoints,
          length: lastWeekPointsLength
        },
        day: {
          data: lastDayPoints,
          length: lastDayPointsLength
        },
      },
      monitorings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.connected = async (req, res) => {
  try {
    res.status(200).json({ connected: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
