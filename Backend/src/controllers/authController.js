const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { z } = require('zod');

const { firebaseAuth, firestore } = require('../config/firebase');
const { uploadBase64Documents } = require('../utils/documentUploader');
const { signInWithEmailAndPassword } = require('../utils/firebaseIdentity');
const { logActivity } = require('../services/activityLogService');

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2),
  role: z.enum(['user', 'company']),
  photoURL: z.string().url().optional(),
  company: z.object({
    companyName: z.string().min(2),
    registrationNumber: z.string().min(3),
    address: z.string().min(5),
    documents: z.array(
      z.union([
        z.string(),
        z.object({
          base64: z.string(),
          fileName: z.string().optional()
        })
      ])
    ).optional()
  }).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const googleSchema = z.object({
  idToken: z.string(),
  role: z.enum(['user', 'company']),
  company: signupSchema.shape.company.optional()
});

const governmentLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

async function signup(req, res, next) {
  try {
    const payload = signupSchema.parse(req.body);

    if (payload.role === 'company' && !payload.company) {
      throw createError(400, 'Company details are required for company role');
    }

    const userRecord = await firebaseAuth.createUser({
      email: payload.email,
      password: payload.password,
      displayName: payload.displayName,
      photoURL: payload.photoURL || undefined
    });

    await firebaseAuth.setCustomUserClaims(userRecord.uid, { role: payload.role });

    const timestamp = new Date().toISOString();
    const status = payload.role === 'company' ? 'pending' : 'approved';

    const userProfile = {
      uid: userRecord.uid,
      email: payload.email,
      displayName: payload.displayName,
      role: payload.role,
      status,
      createdAt: timestamp,
      updatedAt: timestamp,
      photoURL: payload.photoURL || ''
    };

    try {
      await firestore.collection('users').doc(userRecord.uid).set(userProfile);
    } catch (firestoreError) {
      
      if (firestoreError.code === 5) {
        // NOT_FOUND error - Firestore database might not be set up
        throw createError(500, 'Firestore database is not accessible. Please ensure Firestore is enabled in your Firebase project and the service account has proper permissions.');
      }
      throw firestoreError;
    }

    if (payload.role === 'company') {
      const normalizedDocs = payload.company.documents?.map(document =>
        typeof document === 'string' ? { base64: document } : document
      ) || [];
      
      let uploadedDocuments = [];
      try {
        uploadedDocuments = await uploadBase64Documents(normalizedDocs);
      } catch (uploadError) {
        throw createError(500, `Failed to upload documents: ${uploadError.message}`);
      }

      try {
        await firestore.collection('companies').doc(userRecord.uid).set({
          id: userRecord.uid,
          userId: userRecord.uid,
          companyName: payload.company.companyName,
          registrationNumber: payload.company.registrationNumber,
          address: payload.company.address,
          documents: uploadedDocuments,
          status: 'pending',
          rejectionReason: null,
          approvedBy: null,
          approvedAt: null,
          createdAt: timestamp,
          updatedAt: timestamp
        });
      } catch (firestoreError) {
        
        if (firestoreError.code === 5) {
          throw createError(500, 'Firestore database is not accessible. Please ensure Firestore is enabled in your Firebase project and the service account has proper permissions.');
        }
        throw firestoreError;
      }
    }

    try {
      await logActivity({
        action: 'SIGNUP',
        performedBy: userRecord.uid,
        targetUser: userRecord.uid,
        details: { role: payload.role }
      });
    } catch (activityError) {
      // Don't fail signup if activity log fails
    }

    res.status(201).json({
      message: payload.role === 'company'
        ? 'Company submitted successfully. Awaiting government approval.'
        : 'Signup successful.',
      requiresApproval: payload.role === 'company'
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const payload = loginSchema.parse(req.body);
    const authResponse = await signInWithEmailAndPassword(payload.email, payload.password);

    let snapshot;
    let user;
    
    try {
      snapshot = await firestore.collection('users').doc(authResponse.localId).get();
    } catch (firestoreError) {
      if (firestoreError.code !== 5) {
        throw firestoreError;
      }
      snapshot = null;
    }
    
    if (!snapshot || !snapshot.exists) {
      const timestamp = new Date().toISOString();
      const defaultProfile = {
        uid: authResponse.localId,
        email: payload.email,
        displayName: authResponse.displayName || payload.email.split('@')[0],
        role: 'user',
        status: 'approved',
        createdAt: timestamp,
        updatedAt: timestamp,
        photoURL: authResponse.photoUrl || ''
      };
      
      try {
        await firestore.collection('users').doc(authResponse.localId).set(defaultProfile);
        user = defaultProfile;
      } catch (profileCreateErr) {
        if (profileCreateErr.code === 5) {
          user = defaultProfile;
        } else {
          throw createError(500, `Failed to create user profile in database. Error: ${profileCreateErr.message}. Please contact support or try again later.`);
        }
      }
    } else {
      user = snapshot.data();
    }

    if (user.role === 'company' && user.status !== 'approved') {
      throw createError(403, `Company login blocked. Current status: ${user.status}`);
    }
    res.status(200).json({
      token: authResponse.idToken,
      refreshToken: authResponse.refreshToken,
      expiresIn: authResponse.expiresIn,
      user
    });
  } catch (error) {
    next(error);
  }
}

async function googleLogin(req, res, next) {
  try {
    console.log('Google login request received:', req.body);
    const payload = googleSchema.parse(req.body);
    console.log('Payload validated:', payload);
    const decoded = await firebaseAuth.verifyIdToken(payload.idToken);
    console.log('Firebase token decoded:', decoded.uid);

    const userRef = firestore.collection('users').doc(decoded.uid);
    const userSnapshot = await userRef.get();

    const timestamp = new Date().toISOString();

    if (!userSnapshot.exists) {
      const status = payload.role === 'company' ? 'pending' : 'approved';
      const profile = {
        uid: decoded.uid,
        email: decoded.email,
        displayName: decoded.name || decoded.email,
        role: payload.role,
        status,
        createdAt: timestamp,
        updatedAt: timestamp,
        photoURL: decoded.picture || ''
      };

      await userRef.set(profile);
      await firebaseAuth.setCustomUserClaims(decoded.uid, { role: payload.role });

      if (payload.role === 'company') {
        if (!payload.company) {
          throw createError(400, 'Company details are required for company signup');
        }
        const normalizedDocs = payload.company.documents?.map(document =>
          typeof document === 'string' ? { base64: document } : document
        ) || [];
        const uploadedDocuments = await uploadBase64Documents(normalizedDocs);

        await firestore.collection('companies').doc(decoded.uid).set({
          id: decoded.uid,
          userId: decoded.uid,
          companyName: payload.company.companyName,
          registrationNumber: payload.company.registrationNumber,
          address: payload.company.address,
          documents: uploadedDocuments,
          status: 'pending',
          rejectionReason: null,
          approvedBy: null,
          approvedAt: null,
          createdAt: timestamp,
          updatedAt: timestamp
        });
      }

      await logActivity({
        action: 'GOOGLE_SIGNUP',
        performedBy: decoded.uid,
        targetUser: decoded.uid,
        details: { role: payload.role }
      });
    }

    const profile = (await userRef.get()).data();

    if (profile.role === 'company' && profile.status !== 'approved') {
      throw createError(403, `Company login blocked. Current status: ${profile.status}`);
    }

    console.log('Google login successful, returning:', { token: payload.idToken.substring(0, 20) + '...', user: profile });
    res.status(200).json({
      token: payload.idToken,
      user: profile
    });
  } catch (error) {
    next(error);
  }
}

let cachedGovernmentPasswordHash;

function resolveGovernmentPasswordHash() {
  if (cachedGovernmentPasswordHash) {
    return cachedGovernmentPasswordHash;
  }
  const envPassword = process.env.GOVT_ADMIN_PASSWORD || '';
  if (!envPassword) {
    throw new Error('GOVT_ADMIN_PASSWORD is not configured');
  }
  cachedGovernmentPasswordHash = envPassword.startsWith('$2')
    ? envPassword
    : bcrypt.hashSync(envPassword, 10);
  return cachedGovernmentPasswordHash;
}

async function governmentLogin(req, res, next) {
  try {
    const payload = governmentLoginSchema.parse(req.body);

    if (!process.env.GOVT_ADMIN_EMAIL || !process.env.JWT_SECRET) {
      throw createError(500, 'Government credentials are not configured');
    }

    if (payload.email !== process.env.GOVT_ADMIN_EMAIL) {
      throw createError(401, 'Invalid government credentials');
    }

    const passwordHash = resolveGovernmentPasswordHash();
    const isValid = await bcrypt.compare(payload.password, passwordHash);
    if (!isValid) {
      throw createError(401, 'Invalid government credentials');
    }

    const token = jwt.sign(
      {
        email: payload.email,
        role: 'government'
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.status(200).json({
      token,
      user: { email: payload.email, role: 'government' }
    });
  } catch (error) {
    next(error);
  }
}

async function verifyToken(req, res, next) {
  try {
    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;

    if (!token) {
      throw createError(401, 'Missing token');
    }

    const decoded = await firebaseAuth.verifyIdToken(token, true);
    const snapshot = await firestore.collection('users').doc(decoded.uid).get();
    if (!snapshot.exists) {
      throw createError(404, 'User profile missing');
    }

    res.status(200).json({
      valid: true,
      user: snapshot.data()
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  login,
  googleLogin,
  governmentLogin,
  verifyToken
};

