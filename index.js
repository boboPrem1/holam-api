const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("./db");
const http = require("http");
const multer = require("multer");
// import dotenv
require("dotenv").config();
// Yeah
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const PORT = process.env.SERVER_PORT || 4534;
const API_URL_BASE = process.env.API_URL_BASE ? process.env.API_URL_BASE : "/";
// const DASH_URL =
//   process.env.ENV === "dev"
//     ? process.env.DASH_URL_DEV
//     : process.env.DASH_URL_PROD;
const URL_CONNECT_DEV = process.env.URL_CONNECT;

const userRoutes = require("./endpoints/users/userRoutes");
const permissionRoutes = require("./endpoints/permissions/permissionsRoutes");
const apiKeyRoutes = require("./endpoints/apiKeys/apiKeysRoutes");
const profilRoutes = require("./endpoints/profil/profilRoutes");
const userRolesRoutes = require("./endpoints/userRoles/userRoleRoutes");
const userTypesRoutes = require("./endpoints/userTypes/userTypeRoutes");
const authRoutes = require("./endpoints/auth/authRouter");
const otpRoutes = require("./endpoints/otps/otpsRoutes.js");
const countriesRoutes = require("./endpoints/countries/countriesRoutes.js");
const citiesRoutes = require("./endpoints/cities/citiesRoutes.js");
const filesRoutes = require("./endpoints/files/filesRoutes.js");
const ActivitySubCategoryRoutes = require("./endpoints/activitySubCategories/activitySubCategoriesRoutes.js");
const ActivityCategoryRoutes = require("./endpoints/activityCategories/activityCategoriesRoutes.js");
const ActivityRoutes = require("./endpoints/activities/activitiesRoutes.js");
const tagsRoutes = require("./endpoints/tags/tagsRoutes.js");
const commentsRoutes = require("./endpoints/comments/commentsRoutes.js");
const chatsRoutes = require("./endpoints/chats/chatsRoutes.js");
const messagesRoutes = require("./endpoints/messages/messagesRoutes.js");
const notificationsRoutes = require("./endpoints/notifications/notificationsRoutes.js");
const videosRoutes = require("./endpoints/videos/videosRoutes.js");
const forYouRoutes = require("./endpoints/videos/forYouRoutes.js");
const coursesRoutes = require("./endpoints/courses/coursesRoutes.js");
const paymentMeansRoutes = require("./endpoints/paymentMeans/paymentMeansRoutes.js");
const transactionsRoutes = require("./endpoints/transactions/transactionsRoutes.js");
const geolocationServicesRoutes = require("./endpoints/geolocationServices/geolocationServicesRoutes.js");
const geolocationServiceMastersRoutes = require("./endpoints/geolocationServiceMasters/geolocationServiceMastersRoutes.js");
const geolocationServiceAgentsRoutes = require("./endpoints/geolocationServiceAgents/geolocationServiceAgentsRoutes.js");
const geolocationServiceClientsRoutes = require("./endpoints/geolocationServiceClients/geolocationServicesClientsRoutes.js");
const geolocationServiceTransactionsRoutes = require("./endpoints/geolocationServiceTransactions/geolocationServiceTransactionsRoutes.js");
const geolocationServicePointsRoutes = require("./endpoints/geolocationServicePoints/geolocationServicePointsRoutes.js");
const monitoringsRoutes = require("./endpoints/monitorings/monitoringsRoutes.js");
const dashboardRoutes = require("./endpoints/tableauDeBord/dashboardRoutes.js");
const uploadRoutes = require("./endpoints/uploads/uploadRoutes");

const origins = process.env.ORIGINS;
// const ORIGINS_ARRAY = origins.split(",");

// var corsOptions = {
//   origin: function (origin, callback) {
//     if (ORIGINS_ARRAY.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };
// Middleware
//
const { protect, view_user } = require("./endpoints/auth/authController.js");

const { Webhook } = require("fedapay");
const ENDPOINT_SECRET = process.env.FEDA_PAY_WEBHOOK_SECRET;
// app.use(
//   cors({
//     corsOptions,
//   })
// );
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// allow static files
app.use(express.static("public"));

app.get(API_URL_BASE, (req, res) => {
  res.json({
    message: "Bienvenue sur l'API de l'application Possible.Africa",
  });
});

app.post(API_URL_BASE + "webhook", (req, res) => {
  const sig = req.headers["x-fedapay-signature"];

  let event;

  try {
    event = Webhook.constructEvent(req.body, sig, ENDPOINT_SECRET);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
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
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json());

//protections
app.use(API_URL_BASE, authRoutes);

app.use(API_URL_BASE + "for_you", forYouRoutes);
app.use(protect);
app.use(view_user);
app.use(API_URL_BASE + "users", userRoutes);
app.use(API_URL_BASE + "permissions", permissionRoutes);
app.use(API_URL_BASE + "api_keys", apiKeyRoutes);
app.use(API_URL_BASE + "user_types", userTypesRoutes);
app.use(API_URL_BASE + "profil", profilRoutes);
app.use(API_URL_BASE + "user_roles", userRolesRoutes);
app.use(API_URL_BASE + "otps", otpRoutes);
app.use(API_URL_BASE + "countries", countriesRoutes);
app.use(API_URL_BASE + "cities", citiesRoutes);
app.use(API_URL_BASE + "files", filesRoutes);
app.use(API_URL_BASE + "activity_sub_categories", ActivitySubCategoryRoutes);
app.use(API_URL_BASE + "activity_categories", ActivityCategoryRoutes);
app.use(API_URL_BASE + "activities", ActivityRoutes);
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
app.use(
  API_URL_BASE + "monitorings",
  monitoringsRoutes
);
app.use(
  API_URL_BASE + "dashboard",
  dashboardRoutes
);
app.use(API_URL_BASE + "upload", uploadRoutes);

// // Routes

// // const io = new Server(server, {
// //   cors: {
// //     origin: DASH_URL,
// //   },
// // });
// // io.use

// // io.on("connection", (socket) => {
// //   // console.log("Connexion temps réel établie !");
// //   socket.on("disconnect", () => {
// //     // console.log("Utilisateur déconnecté");
// //   });
// // });

// // Start server
// server.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
// connection(URL_CONNECT_DEV);
// // module.exports.io = io;
const socketIo = require("socket.io");

// Importer les modules requis

// const http = require("http");
const dotenv = require("dotenv");
// const connection = require("./db");
// Charger les variables d'environnement
dotenv.config();

// Initialisation de l'application
// const app = express();
// const app = require("./app.js");
// const server = http.createServer(app);
// const {initializeSocket} = require("./socket");

const io = socketIo(server, {
  cors: {
    origin: "*", // Permet toutes les origines
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Méthodes autorisées
    allowedHeaders: ["Content-Type"], // Headers autorisés
    credentials: true, // Autorise l'envoi de cookies si nécessaire
  },
});

io.on("connection", (socket) => {
  console.log("connexion established", socket.id);
  socket.on("emitToBack", (message) => {
    console.log(message);
    socket.emit("emitBackToBack", message + " Transmitted by the back server ...");
  });
});

function sendNotificationToClients(message) {
  if (io) {
    io.emit("notification", message);
  }
}

// const PORT = process.env.SERVER_PORT || 4534;

// const URL_CONNECT_DEV = process.env.URL_CONNECT;
// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  connection(URL_CONNECT_DEV); // Connexion à la base de données
});

module.exports = { sendNotificationToClients };
