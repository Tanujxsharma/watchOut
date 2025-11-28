const admin = require('firebase-admin');

function getFirebaseCredential() {
  // Option 1: Use serviceAccountKey.json if it exists
  const path = require('path');
  const fs = require('fs');
  const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const serviceAccount = require(serviceAccountPath);
      return admin.credential.cert(serviceAccount);
    } catch (error) {
      throw new Error(`Failed to load credentials from serviceAccountKey.json: ${error.message}`);
    }
  }

  // Option 2: Use GOOGLE_APPLICATION_CREDENTIALS environment variable
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      return admin.credential.applicationDefault();
    } catch (error) {
      throw new Error(`Failed to load credentials from GOOGLE_APPLICATION_CREDENTIALS: ${error.message}`);
    }
  }

  // Option 3: Use individual environment variables
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error('FIREBASE_PROJECT_ID is required when using FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY');
    }
    
    try {
      return admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      });
    } catch (error) {
      throw new Error(`Failed to initialize Firebase credential: ${error.message}. Check that FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY are valid.`);
    }
  }

  throw new Error('Firebase credentials are not configured. Provide serviceAccountKey.json, GOOGLE_APPLICATION_CREDENTIALS, or FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY/FIREBASE_PROJECT_ID.');
}

if (!admin.apps.length) {
  try {
    const credential = getFirebaseCredential();
    admin.initializeApp({
      credential,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
  } catch (error) {
    throw error;
  }
}

const firestore = admin.firestore();
const firebaseAuth = admin.auth();

module.exports = { admin, firestore, firebaseAuth };

