const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

// Update this path to match your service account file location
const path = require('path');
const serviceAccount = require(path.join(__dirname, '..', 'pavlovsbook-firebase-adminsdk-fbsvc-6b0334193e.json'));

// Your Firebase Storage bucket
const STORAGE_BUCKET = 'pavlovsbook.appspot.com';

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: STORAGE_BUCKET
});

async function setCorsConfiguration() {
  try {
    const bucket = getStorage().bucket();
    
    console.log(`Setting CORS for bucket: ${STORAGE_BUCKET}`);
    
    await bucket.setCorsConfiguration([
      {
        origin: ['*'], // Allows all origins
        method: ['GET', 'HEAD'],
        maxAgeSeconds: 3600,
        responseHeader: ['Content-Type', 'Accept-Ranges', 'Content-Length', 'Content-Encoding']
      }
    ]);
    
    console.log('✅ CORS configuration updated successfully!');
    console.log('Your PDFs should now be accessible from your web app.');
  } catch (error) {
    console.error('❌ Error setting CORS:', error);
  }
}

setCorsConfiguration();