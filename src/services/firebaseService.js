// src/services/firebaseService.js
const admin = require("firebase-admin");
const base64ServiceAccount =
  require("./../utils/constants").base64ServiceAccount;

const serviceAccountJSON = Buffer.from(base64ServiceAccount, "base64").toString(
  "utf8"
);

const serviceAccount = JSON.parse(serviceAccountJSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
