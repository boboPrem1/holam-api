// const { io } = require("../index.js");

// io.on("connection", (socket) => {
//   console.log("Connexion temps réel établie !");
//   socket.on("disconnect", () => {
//     console.log("Utilisateur déconnecté");
//   });
// });


const { io } = require("../index.js");

io.on("connection", (socket) => {
  console.log(`Nouvel utilisateur connecté : ${socket.id}`);

  // Gérer les événements spécifiques si nécessaire
  socket.on("custom-event", (data) => {
    console.log(`Données reçues de l'utilisateur ${socket.id}:`, data);
    // Vous pouvez également émettre des événements à un utilisateur spécifique ou à tous les utilisateurs
    // socket.emit("response-event", { message: "Réponse envoyée au client" });
  });

  // Déconnexion de l'utilisateur
  socket.on("disconnect", (reason) => {
    console.log(`Utilisateur déconnecté : ${socket.id}, Raison: ${reason}`);
  });

  // Gérer les erreurs
  socket.on("error", (err) => {
    console.error(`Erreur avec l'utilisateur ${socket.id} : ${err.message}`);
  });
});
