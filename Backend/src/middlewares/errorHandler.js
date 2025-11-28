const { ZodError } = require('zod');

function errorHandler(err, req, res, _next) {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
    status: err.status || err.statusCode
  });

  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'Security token mismatch. Please refresh the page and try again.'
    });
  }

  if (err instanceof ZodError) {
    return res.status(422).json({
      error: 'ValidationError',
      message: 'One or more fields are invalid.',
      details: err.errors
    });
  }

  // Firebase Admin errors
  if (err.code === 'auth/invalid-credential' || err.message?.includes('invalid_grant') || err.message?.includes('OAuth2')) {
    return res.status(500).json({
      error: 'FirebaseConfigurationError',
      message: 'Firebase Admin SDK configuration error. Please check your service account credentials.',
      hint: 'Verify FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, and FIREBASE_PROJECT_ID in your .env file.'
    });
  }

  // Firebase permission errors
  if (err.code === 'auth/internal-error' && (err.message?.includes('PERMISSION_DENIED') || err.message?.includes('serviceusage.serviceUsageConsumer'))) {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'watchout-f17d6';
    const iamUrl = `https://console.cloud.google.com/iam-admin/iam?project=${projectId}`;
    
    return res.status(500).json({
      error: 'FirebasePermissionError',
      message: 'Service account lacks required permissions to use Firebase project.',
      hint: 'Your service account needs the following roles in Google Cloud IAM:',
      requiredRoles: [
        'Service Usage Consumer (roles/serviceusage.serviceUsageConsumer)',
        'Firebase Admin SDK Administrator Service Agent (roles/firebase.adminsdk.adminServiceAgent)',
        'Cloud Datastore User (roles/datastore.user)'
      ],
      steps: [
        `1. Go to: ${iamUrl}`,
        '2. Find your service account (check FIREBASE_CLIENT_EMAIL in .env)',
        '3. Click the edit (pencil) icon',
        '4. Click "ADD ANOTHER ROLE"',
        '5. Add all three roles listed above',
        '6. Click "SAVE"',
        '7. Wait 2-3 minutes for propagation',
        '8. Restart your backend server'
      ],
      directLink: iamUrl
    });
  }

  // Firebase Identity Toolkit API errors
  if (err.code === 'MISSING_API_KEY' || err.message?.includes('FIREBASE_API_KEY') || err.message?.includes('API key')) {
    return res.status(500).json({
      error: 'FirebaseConfigurationError',
      message: 'Firebase API key is missing or invalid.',
      hint: 'Set FIREBASE_API_KEY in your backend .env file. Get it from Firebase Console → Project Settings → General → Web API Key.'
    });
  }

  // Firebase REST API errors
  if (err.response?.data?.error) {
    const firebaseError = err.response.data.error;
    return res.status(400).json({
      error: 'FirebaseAuthError',
      message: firebaseError.message || 'Firebase authentication failed',
      code: firebaseError.code || 'auth/unknown-error'
    });
  }

  // Firestore NOT_FOUND errors (but only if not already handled)
  if ((err.code === 5 || err.message?.includes('NOT_FOUND')) && !err.status) {
    // Check if this is a Firestore setup issue
    if (err.message?.includes('Firestore database is not accessible')) {
      return res.status(500).json({
        error: 'FirestoreConfigurationError',
        message: err.message,
        hint: 'Please enable Firestore Database in Firebase Console and ensure your service account has Cloud Datastore User or Firebase Admin SDK Administrator Service Agent role.'
      });
    }
    // Only return this if it's a raw Firestore error that wasn't caught
    return res.status(404).json({
      error: 'FirestoreError',
      message: 'Resource not found in database.',
      hint: 'The requested document does not exist in Firestore. This may be automatically fixed on next login attempt.'
    });
  }

  const status = err.status || err.statusCode || 500;

  res.status(status).json({
    error: err.name || 'ServerError',
    message: err.message || 'Unexpected server error',
    ...(process.env.NODE_ENV === 'development' && err.stack ? { stack: err.stack } : {}),
    ...(err.details ? { details: err.details } : {})
  });
}

module.exports = { errorHandler };

