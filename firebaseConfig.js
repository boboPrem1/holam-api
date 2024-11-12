const admin = require('firebase-admin');
const serviceAccount = require('./fcmServiceAccountKey.json');

admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();
const db = admin.firestore()

module.exports.messaging = messaging;
module.exports.db = db;