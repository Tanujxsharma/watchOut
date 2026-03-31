const axios = require('axios');

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

async function signInWithEmailAndPassword(email, password) {
  if (!FIREBASE_API_KEY) {
    const error = new Error('FIREBASE_API_KEY is not configured. Please set it in your .env file.');
    error.code = 'MISSING_API_KEY';
    throw error;
  }

  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
  
  try {
    const { data } = await axios.post(url, {
      email,
      password,
      returnSecureToken: true
    }, {
      timeout: 10000 // 10 second timeout
    });
    return data;
  } catch (error) {
    if (error.response?.data?.error) {
      const firebaseError = error.response.data.error;
      const err = new Error(firebaseError.message || 'Firebase authentication failed');
      err.code = firebaseError.code || 'auth/unknown-error';
      throw err;
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    throw error;
  }
}

async function signInWithCustomToken(token) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`;
  const { data } = await axios.post(url, {
    token,
    returnSecureToken: true
  });
  return data;
}

module.exports = {
  signInWithEmailAndPassword,
  signInWithCustomToken
};

