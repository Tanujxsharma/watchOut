const { z } = require('zod');
const createError = require('http-errors');
const { firestore } = require('../config/firebase');
const { logActivity } = require('../services/activityLogService');
const { nanoid } = require('nanoid');

const complaintSchema = z.object({
  tenderId: z.string(),
  issue: z.string().min(20),
  priority: z.enum(['low', 'medium', 'high']).default('medium')
});

const responseSchema = z.object({
  response: z.string().min(10),
  status: z.enum(['under_review', 'resolved', 'dismissed'])
});

async function submitComplaint(req, res, next) {
  try {
    const payload = complaintSchema.parse(req.body);
    
    // Check if tender exists
    const tenderRef = firestore.collection('tenders').doc(payload.tenderId);
    const tenderDoc = await tenderRef.get();
    
    if (!tenderDoc.exists) {
      throw createError(404, 'Tender not found');
    }

    const timestamp = new Date().toISOString();
    const complaintId = nanoid(10);

    const complaintData = {
      id: complaintId,
      tenderId: payload.tenderId,
      tenderTitle: tenderDoc.data().title,
      userId: req.user.uid,
      userEmail: req.user.email,
      issue: payload.issue,
      priority: payload.priority,
      status: 'submitted',
      response: null,
      assignedTo: null,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    await firestore.collection('complaints').doc(complaintId).set(complaintData);

    // Increment complaint count on tender
    await tenderRef.update({
      complaintCount: (tenderDoc.data().complaintCount || 0) + 1
    });

    await logActivity({
      action: 'COMPLAINT_FILED',
      performedBy: req.user.uid,
      targetUser: 'system',
      details: { complaintId, tenderId: payload.tenderId }
    });

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: complaintData
    });
  } catch (error) {
    next(error);
  }
}

async function getComplaintsByTender(req, res, next) {
  try {
    const { tenderId } = req.params;
    
    const snapshot = await firestore.collection('complaints')
      .where('tenderId', '==', tenderId)
      .get();

    const complaints = snapshot.docs.map(doc => doc.data());
    complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ complaints });
  } catch (error) {
    next(error);
  }
}

async function getUserComplaints(req, res, next) {
  try {
    const snapshot = await firestore.collection('complaints')
      .where('userId', '==', req.user.uid)
      .get();

    const complaints = snapshot.docs.map(doc => doc.data());
    complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ complaints });
  } catch (error) {
    next(error);
  }
}

async function updateComplaintStatus(req, res, next) {
  try {
    const { id } = req.params;
    const payload = responseSchema.parse(req.body);
    const timestamp = new Date().toISOString();

    const complaintRef = firestore.collection('complaints').doc(id);
    const doc = await complaintRef.get();

    if (!doc.exists) {
      throw createError(404, 'Complaint not found');
    }

    await complaintRef.update({
      status: payload.status,
      response: payload.response,
      updatedAt: timestamp,
      resolvedBy: req.governmentUser.email,
      resolvedAt: timestamp
    });

    await logActivity({
      action: 'COMPLAINT_RESOLVED',
      performedBy: req.governmentUser.email,
      targetUser: doc.data().userId,
      details: { complaintId: id, status: payload.status }
    });

    res.status(200).json({
      message: 'Complaint updated successfully',
      complaint: { ...doc.data(), status: payload.status, response: payload.response }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitComplaint,
  getComplaintsByTender,
  getUserComplaints,
  updateComplaintStatus
};
