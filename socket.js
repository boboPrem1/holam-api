const socketIo = require("socket.io");
let io;
function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", // Permet toutes les origines
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Méthodes autorisées
      allowedHeaders: ["Content-Type"], // Headers autorisés
    //   accessControlAllowOrigin: "*",
        credentials: true, // Autorise l'envoi de cookies si nécessaire
    },
  });

  io.on("connection", (socket) => {
    socket.on("notification", (message) => {
      console.log(message);
    });
  });

  return io;
}

function sendNotificationToClients(message) {
  if (io) {
    io.emit("notification", message);
  }
}

module.exports = { initializeSocket, sendNotificationToClients };
