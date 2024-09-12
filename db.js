// const mongoose = require("mongoose");

// const connection = (URL_CONNECT_DEV) => {
//   mongoose
//     .connect(URL_CONNECT_DEV)
//     .then((connection) => {
//       console.log("Database connection successful ...");
//     })
//     .catch((e) => {
//       console.log("Something went wrong, Error: " + e);
//     });
// };

// // Exclude sensibles and timestamps from response
// mongoose.set("toJSON", {
//   virtuals: true,
//   versionKey: false,
//   transform: function (doc, ret) {
//     delete ret.__v;
//     delete ret.updatedAt;
//     delete ret.password;
//     return ret;
//   },
// });

// // Export connection
// module.exports = connection;


const mongoose = require("mongoose");

// Fonction de connexion asynchrone à MongoDB
const connectToDatabase = async (URL_CONNECT_DEV) => {
  try {
    await mongoose.connect(URL_CONNECT_DEV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful...");
  } catch (error) {
    console.error("Database connection error: ", error.message);
    process.exit(1); // Arrêter le processus en cas d'erreur critique
  }
};

// Configuration pour exclure les champs sensibles et gérer la réponse JSON
mongoose.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.__v; // Supprime la version du document
    delete ret.updatedAt; // Supprime le champ updatedAt
    delete ret.password; // Supprime le champ mot de passe
    return ret;
  },
});

// Exporter la fonction de connexion
module.exports = connectToDatabase;
