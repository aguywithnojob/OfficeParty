const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You'll need to add your service account key from Firebase Console
const initializeFirebase = () => {
  try {
    // For Render deployment, use environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    } else {
      // For local development, use service account file
      const serviceAccount = require('./firebase-service-account.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://partyplanner-4e981-default-rtdb.firebaseio.com"
      });
    }
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
  }
};

const db = () => admin.database();

module.exports = { initializeFirebase, db };
