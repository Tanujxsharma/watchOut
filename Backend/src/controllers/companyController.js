const createError = require('http-errors');
const { z } = require('zod');
const { firestore } = require('../config/firebase');
const { uploadBase64Documents } = require('../utils/documentUploader');
const { logActivity } = require('../services/activityLogService');

const companySchema = z.object({
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
});

async function registerCompany(req, res, next) {
  try {
    if (req.user.role !== 'company') {
      throw createError(403, 'Only company accounts can register company data');
    }

    const payload = companySchema.parse(req.body);
    const timestamp = new Date().toISOString();

    const normalizedDocs = payload.documents?.map(document =>
      typeof document === 'string' ? { base64: document } : document
    ) || [];

    const uploadedDocuments = await uploadBase64Documents(normalizedDocs);

    const companyRef = firestore.collection('companies').doc(req.user.uid);
    await companyRef.set({
      id: req.user.uid,
      userId: req.user.uid,
      companyName: payload.companyName,
      registrationNumber: payload.registrationNumber,
      address: payload.address,
      documents: uploadedDocuments,
      status: 'pending',
      rejectionReason: null,
      approvedBy: null,
      approvedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    await firestore.collection('users').doc(req.user.uid).update({
      status: 'pending',
      updatedAt: timestamp
    });

    await logActivity({
      action: 'COMPANY_REGISTRATION',
      performedBy: req.user.uid,
      targetUser: req.user.uid,
      details: { companyName: payload.companyName }
    });

    res.status(201).json({
      message: 'Company submitted for approval',
      company: (await companyRef.get()).data()
    });
  } catch (error) {
    next(error);
  }
}

async function getCompanyProfile(req, res, next) {
  try {
    const companyRef = firestore.collection('companies').doc(req.user.uid);
    const snapshot = await companyRef.get();

    if (!snapshot.exists) {
      throw createError(404, 'Company profile not found');
    }

    res.status(200).json(snapshot.data());
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerCompany,
  getCompanyProfile
};

