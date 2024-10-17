const { Webhook } = require("fedapay");
require("dotenv").config();

const ENDPOINT_SECRET = process.env.FEDA_PAY_WEBHOOK_SECRET;

const cors = require("cors");
const bodyParser = require("body-parser");

const express = require("express");
const app = express();
// Variables d'environnement
const API_URL_BASE = process.env.API_URL_BASE || "/";


// Importation des routes
const userRoutes = require("./endpoints/users/userRoutes");
const permissionRoutes = require("./endpoints/permissions/permissionsRoutes");
const apiKeyRoutes = require("./endpoints/apiKeys/apiKeysRoutes");
const profilRoutes = require("./endpoints/profil/profilRoutes");
const userRolesRoutes = require("./endpoints/userRoles/userRoleRoutes");
const userTypesRoutes = require("./endpoints/userTypes/userTypeRoutes");
const authRoutes = require("./endpoints/auth/authRouter");
const otpRoutes = require("./endpoints/otps/otpsRoutes");
const countriesRoutes = require("./endpoints/countries/countriesRoutes");
const citiesRoutes = require("./endpoints/cities/citiesRoutes");
const favouritesCitiesRoutes = require("./endpoints/favourite_cities/favouritesCitiesRoutes.js");
const filesRoutes = require("./endpoints/files/filesRoutes");
const activitySubCategoryRoutes = require("./endpoints/activitySubCategories/activitySubCategoriesRoutes");
const activityCategoryRoutes = require("./endpoints/activityCategories/activityCategoriesRoutes");
const activityRoutes = require("./endpoints/activities/activitiesRoutes");
const tagsRoutes = require("./endpoints/tags/tagsRoutes");
const commentsRoutes = require("./endpoints/comments/commentsRoutes");
const chatsRoutes = require("./endpoints/chats/chatsRoutes");
const messagesRoutes = require("./endpoints/messages/messagesRoutes");
const notificationsRoutes = require("./endpoints/notifications/notificationsRoutes");
const videosRoutes = require("./endpoints/videos/videosRoutes");
const forYouRoutes = require("./endpoints/videos/forYouRoutes");
const coursesRoutes = require("./endpoints/courses/coursesRoutes");
const paymentMeansRoutes = require("./endpoints/paymentMeans/paymentMeansRoutes");
const transactionsRoutes = require("./endpoints/transactions/transactionsRoutes");
const geolocationServicesRoutes = require("./endpoints/geolocationServices/geolocationServicesRoutes");
const geolocationServiceMastersRoutes = require("./endpoints/geolocationServiceMasters/geolocationServiceMastersRoutes");
const geolocationServiceAgentsRoutes = require("./endpoints/geolocationServiceAgents/geolocationServiceAgentsRoutes");
const geolocationServiceClientsRoutes = require("./endpoints/geolocationServiceClients/geolocationServicesClientsRoutes");
const geolocationServiceTransactionsRoutes = require("./endpoints/geolocationServiceTransactions/geolocationServiceTransactionsRoutes");
const geolocationServicePointsRoutes = require("./endpoints/geolocationServicePoints/geolocationServicePointsRoutes");
const geolocationServicePointsRoutesNeo = require("./endpoints/geolocationServicePoints/geolocationServicePointsRoutesNeo.js");
const monitoringsRoutes = require("./endpoints/monitorings/monitoringsRoutes");
const dashboardRoutes = require("./endpoints/tableauDeBord/dashboardRoutes");
const uploadRoutes = require("./endpoints/uploads/uploadRoutes");

const { protect, view_user } = require("./endpoints/auth/authController");

// Middleware CORS
app.use(cors());

// Middleware Body-Parser pour traiter les requêtes JSON et URL-encoded
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Permettre l'accès aux fichiers statiques (images, etc.)
app.use(express.static("public"));

// Authentification et routes publiques
// Route de test pour l'API
app.get(API_URL_BASE, (req, res) => {
  res.json({
    message: "Bienvenue sur l'API de l'application Possible.Africa",
  });
});

app.post(API_URL_BASE + "/webhook", (req, res) => {
  const sig = req.headers["x-fedapay-signature"];

  let event;

  try {
    event = Webhook.constructEvent(request.body, sig, ENDPOINT_SECRET);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.name) {
    case "transaction.created":
      // Transaction créée
      break;
    case "transaction.approved":
      // Transaction approuvée
      break;
    case "transaction.canceled":
      // Transaction annulée
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  console.log(req.body);
  console.log(event);

  res.status(200).send({
    event,
    body: req.body,
  });
});
app.use(API_URL_BASE, authRoutes);
app.use(API_URL_BASE + "for_you", forYouRoutes);

// Middleware pour la protection des routes (nécessite authentification)
app.use(protect);
app.use(view_user);

// Routes protégées
app.use(API_URL_BASE + "users", userRoutes);
app.use(API_URL_BASE + "permissions", permissionRoutes);
app.use(API_URL_BASE + "api_keys", apiKeyRoutes);
app.use(API_URL_BASE + "profil", profilRoutes);
app.use(API_URL_BASE + "user_roles", userRolesRoutes);
app.use(API_URL_BASE + "otps", otpRoutes);
app.use(API_URL_BASE + "countries", countriesRoutes);
app.use(API_URL_BASE + "cities", citiesRoutes);
app.use(API_URL_BASE + "fav_cities", favouritesCitiesRoutes);
app.use(API_URL_BASE + "files", filesRoutes);
app.use(API_URL_BASE + "activity_sub_categories", activitySubCategoryRoutes);
app.use(API_URL_BASE + "activity_categories", activityCategoryRoutes);
app.use(API_URL_BASE + "activities", activityRoutes);
app.use(API_URL_BASE + "tags", tagsRoutes);
app.use(API_URL_BASE + "comments", commentsRoutes);
app.use(API_URL_BASE + "chats", chatsRoutes);
app.use(API_URL_BASE + "messages", messagesRoutes);
app.use(API_URL_BASE + "notifications", notificationsRoutes);
app.use(API_URL_BASE + "videos", videosRoutes);
app.use(API_URL_BASE + "courses", coursesRoutes);
app.use(API_URL_BASE + "transactions", transactionsRoutes);
app.use(API_URL_BASE + "payment_means", paymentMeansRoutes);
app.use(API_URL_BASE + "geolocation_services", geolocationServicesRoutes);
app.use(
  API_URL_BASE + "geolocation_service_masters",
  geolocationServiceMastersRoutes
);
app.use(
  API_URL_BASE + "geolocation_service_agents",
  geolocationServiceAgentsRoutes
);
app.use(
  API_URL_BASE + "geolocation_service_clients",
  geolocationServiceClientsRoutes
);
app.use(
  API_URL_BASE + "geolocation_service_transactions",
  geolocationServiceTransactionsRoutes
);
app.use(
  API_URL_BASE + "geolocation_service_points",
  geolocationServicePointsRoutes
);
app.use(API_URL_BASE + "utils", geolocationServicePointsRoutesNeo);
app.use(API_URL_BASE + "monitorings", monitoringsRoutes);
app.use(API_URL_BASE + "dashboard", dashboardRoutes);
app.use(API_URL_BASE + "upload", uploadRoutes);



module.exports = app;
