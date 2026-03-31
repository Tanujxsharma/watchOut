const { z } = require('zod');
const createError = require('http-errors');
const { firestore } = require('../config/firebase');
const { logActivity } = require('../services/activityLogService');
const { nanoid } = require('nanoid');

const tenderSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  budget: z.number().positive(),
  deadline: z.string().datetime(), // Expecting ISO string
  category: z.string(),
  location: z.string(),
  requirements: z.array(z.string()).min(1),
  status: z.enum(['open', 'closed', 'awarded', 'draft']).default('open')
});

const updateTenderSchema = tenderSchema.partial();

async function createTender(req, res, next) {
  try {
    const payload = tenderSchema.parse(req.body);
    const tenderId = nanoid(10);
    const timestamp = new Date().toISOString();

    const tenderData = {
      id: tenderId,
      ...payload,
      issuer: 'Government of India', // Could be dynamic based on admin profile
      createdBy: req.governmentUser.email,
      createdAt: timestamp,
      updatedAt: timestamp,
      bidCount: 0,
      complaintCount: 0
    };

    await firestore.collection('tenders').doc(tenderId).set(tenderData);

    await logActivity({
      action: 'TENDER_CREATED',
      performedBy: req.governmentUser.email,
      targetUser: 'system',
      details: { tenderId, title: payload.title }
    });

    res.status(201).json({
      message: 'Tender created successfully',
      tender: tenderData
    });
  } catch (error) {
    next(error);
  }
}

async function getAllTenders(req, res, next) {
  try {
    const snapshot = await firestore.collection('tenders').get();
    const tenders = [];
    
    snapshot.forEach(doc => {
      tenders.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json(tenders);
  } catch (error) {
    next(error);
  }
}

async function getTenderById(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await firestore.collection('tenders').doc(id).get();

    if (!doc.exists) {
      throw createError(404, 'Tender not found');
    }

    res.status(200).json(doc.data());
  } catch (error) {
    next(error);
  }
}

async function updateTender(req, res, next) {
  try {
    const { id } = req.params;
    const payload = updateTenderSchema.parse(req.body);
    const timestamp = new Date().toISOString();

    const tenderRef = firestore.collection('tenders').doc(id);
    const doc = await tenderRef.get();

    if (!doc.exists) {
      throw createError(404, 'Tender not found');
    }

    const updateData = {
      ...payload,
      updatedAt: timestamp
    };

    await tenderRef.update(updateData);

    await logActivity({
      action: 'TENDER_UPDATED',
      performedBy: req.governmentUser.email,
      targetUser: 'system',
      details: { tenderId: id, updates: Object.keys(payload) }
    });

    res.status(200).json({
      message: 'Tender updated successfully',
      tender: { ...doc.data(), ...updateData }
    });
  } catch (error) {
    next(error);
  }
}

async function deleteTender(req, res, next) {
  try {
    const { id } = req.params;
    const tenderRef = firestore.collection('tenders').doc(id);
    const doc = await tenderRef.get();

    if (!doc.exists) {
      throw createError(404, 'Tender not found');
    }

    await tenderRef.delete();

    await logActivity({
      action: 'TENDER_DELETED',
      performedBy: req.governmentUser.email,
      targetUser: 'system',
      details: { tenderId: id, title: doc.data().title }
    });

    res.status(200).json({ message: 'Tender deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTender,
  getAllTenders,
  getTenderById,
  updateTender,
  deleteTender
};
