const { z } = require('zod');
const createError = require('http-errors');
const { firestore } = require('../config/firebase');
const { logActivity } = require('../services/activityLogService');

const decisionSchema = z.object({
  rejectionReason: z.string().min(5).optional()
});

async function getPendingCompanies(_req, res, next) {
  try {
    const snapshot = await firestore.collection('companies')
      .where('status', '==', 'pending')
      .get();

    const companies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    companies.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB;
    });
    res.status(200).json({ companies });
  } catch (error) {
    next(error);
  }
}

async function getCompanyById(req, res, next) {
  try {
    const doc = await firestore.collection('companies').doc(req.params.id).get();
    if (!doc.exists) {
      throw createError(404, 'Company not found');
    }
    res.status(200).json(doc.data());
  } catch (error) {
    next(error);
  }
}

async function approveCompany(req, res, next) {
  try {
    const companyRef = firestore.collection('companies').doc(req.params.id);
    const snapshot = await companyRef.get();
    if (!snapshot.exists) {
      throw createError(404, 'Company not found');
    }

    const timestamp = new Date().toISOString();
    await companyRef.update({
      status: 'approved',
      rejectionReason: null,
      approvedBy: req.governmentUser.email,
      approvedAt: timestamp,
      updatedAt: timestamp
    });

    await firestore.collection('users').doc(req.params.id).update({
      status: 'approved',
      updatedAt: timestamp
    });

    await logActivity({
      action: 'COMPANY_APPROVED',
      performedBy: req.governmentUser.email,
      targetUser: req.params.id,
      details: { companyName: snapshot.data().companyName }
    });

    res.status(200).json({
      message: 'Company approved successfully',
      company: (await companyRef.get()).data()
    });
  } catch (error) {
    next(error);
  }
}

async function rejectCompany(req, res, next) {
  try {
    const payload = decisionSchema.parse(req.body);
    if (!payload.rejectionReason) {
      throw createError(400, 'Rejection reason is required');
    }

    const companyRef = firestore.collection('companies').doc(req.params.id);
    const snapshot = await companyRef.get();
    if (!snapshot.exists) {
      throw createError(404, 'Company not found');
    }

    const timestamp = new Date().toISOString();
    await companyRef.update({
      status: 'rejected',
      rejectionReason: payload.rejectionReason,
      approvedBy: req.governmentUser.email,
      approvedAt: timestamp,
      updatedAt: timestamp
    });

    await firestore.collection('users').doc(req.params.id).update({
      status: 'rejected',
      updatedAt: timestamp
    });

    await logActivity({
      action: 'COMPANY_REJECTED',
      performedBy: req.governmentUser.email,
      targetUser: req.params.id,
      details: {
        companyName: snapshot.data().companyName,
        rejectionReason: payload.rejectionReason
      }
    });

    res.status(200).json({
      message: 'Company rejected',
      company: (await companyRef.get()).data()
    });
  } catch (error) {
    next(error);
  }
}

async function getAnalytics(_req, res, next) {
  try {
    const collection = firestore.collection('companies');

    const [pendingSnap, approvedSnap, rejectedSnap, totalSnap, logsSnap] = await Promise.all([
      collection.where('status', '==', 'pending').get(),
      collection.where('status', '==', 'approved').get(),
      collection.where('status', '==', 'rejected').get(),
      collection.get(),
      firestore.collection('activityLogs').limit(20).get()
    ]);

    const activity = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    activity.sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA;
    });

    res.status(200).json({
      totals: {
        totalCompanies: totalSnap.size,
        pending: pendingSnap.size,
        approved: approvedSnap.size,
        rejected: rejectedSnap.size
      },
      activity: activity.slice(0, 20)
    });
  } catch (error) {
    next(error);
  }
}

async function getCompaniesByStatus(req, res, next) {
  try {
    const status = req.params.status;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      throw createError(400, 'Unsupported status filter');
    }
    const snapshot = await firestore.collection('companies')
      .where('status', '==', status)
      .get();
    
    const companies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    companies.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
    
    res.status(200).json({ companies });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPendingCompanies,
  getCompanyById,
  approveCompany,
  rejectCompany,
  getAnalytics,
  getCompaniesByStatus
};

