const { z } = require('zod');
const createError = require('http-errors');
const { firestore } = require('../config/firebase');
const { logActivity } = require('../services/activityLogService');
const { nanoid } = require('nanoid');
const { uploadBase64Documents } = require('../utils/documentUploader');

const bidSchema = z.object({
  tenderId: z.string(),
  bidAmount: z.number().positive(),
  technicalProposal: z.string().min(50), // Description or text content
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

const statusUpdateSchema = z.object({
  status: z.enum(['under_review', 'accepted', 'rejected']),
  remarks: z.string().optional()
});

async function submitBid(req, res, next) {
  try {
    if (req.user.role !== 'company') {
      throw createError(403, 'Only companies can submit bids');
    }

    // Check if company is approved
    const companyDoc = await firestore.collection('companies').doc(req.user.uid).get();
    if (!companyDoc.exists || companyDoc.data().status !== 'approved') {
      throw createError(403, 'Company must be approved to submit bids');
    }

    const payload = bidSchema.parse(req.body);
    
    // Check if tender exists and is open
    const tenderRef = firestore.collection('tenders').doc(payload.tenderId);
    const tenderDoc = await tenderRef.get();
    
    if (!tenderDoc.exists) {
      throw createError(404, 'Tender not found');
    }
    
    if (tenderDoc.data().status !== 'open') {
      throw createError(400, 'Tender is not open for bidding');
    }

    // Check if already bid
    const existingBid = await firestore.collection('bids')
      .where('tenderId', '==', payload.tenderId)
      .where('companyId', '==', req.user.uid)
      .get();

    if (!existingBid.empty) {
      throw createError(400, 'Company has already submitted a bid for this tender');
    }

    const timestamp = new Date().toISOString();
    const bidId = nanoid(10);

    // Upload documents
    const normalizedDocs = payload.documents?.map(document =>
      typeof document === 'string' ? { base64: document } : document
    ) || [];

    const uploadedDocuments = await uploadBase64Documents(normalizedDocs);

    const bidData = {
      id: bidId,
      tenderId: payload.tenderId,
      tenderTitle: tenderDoc.data().title,
      companyId: req.user.uid,
      companyName: companyDoc.data().companyName,
      bidAmount: payload.bidAmount,
      technicalProposal: payload.technicalProposal,
      documents: uploadedDocuments,
      status: 'submitted',
      submittedAt: timestamp,
      updatedAt: timestamp
    };

    await firestore.collection('bids').doc(bidId).set(bidData);

    // Increment bid count on tender
    await tenderRef.update({
      bidCount: (tenderDoc.data().bidCount || 0) + 1
    });

    await logActivity({
      action: 'BID_SUBMITTED',
      performedBy: req.user.uid,
      targetUser: 'system',
      details: { bidId, tenderId: payload.tenderId, amount: payload.bidAmount }
    });

    res.status(201).json({
      message: 'Bid submitted successfully',
      bid: bidData
    });
  } catch (error) {
    next(error);
  }
}

async function getBidsByTender(req, res, next) {
  try {
    const { tenderId } = req.params;
    
    const snapshot = await firestore.collection('bids')
      .where('tenderId', '==', tenderId)
      .get();

    const bids = snapshot.docs.map(doc => doc.data());
    
    // Sort by bid amount asc (for government to see lowest bids)
    bids.sort((a, b) => a.bidAmount - b.bidAmount);

    res.status(200).json({ bids });
  } catch (error) {
    next(error);
  }
}

async function getCompanyBids(req, res, next) {
  try {
    const snapshot = await firestore.collection('bids')
      .where('companyId', '==', req.user.uid)
      .get();

    const bids = snapshot.docs.map(doc => doc.data());
    bids.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.status(200).json({ bids });
  } catch (error) {
    next(error);
  }
}

async function updateBidStatus(req, res, next) {
  try {
    const { id } = req.params;
    const payload = statusUpdateSchema.parse(req.body);
    const timestamp = new Date().toISOString();

    const bidRef = firestore.collection('bids').doc(id);
    const bidDoc = await bidRef.get();

    if (!bidDoc.exists) {
      throw createError(404, 'Bid not found');
    }

    await bidRef.update({
      status: payload.status,
      remarks: payload.remarks || null,
      updatedAt: timestamp,
      evaluatedBy: req.governmentUser.email,
      evaluatedAt: timestamp
    });

    await logActivity({
      action: 'BID_STATUS_UPDATED',
      performedBy: req.governmentUser.email,
      targetUser: bidDoc.data().companyId,
      details: { bidId: id, status: payload.status }
    });

    res.status(200).json({
      message: `Bid status updated to ${payload.status}`,
      bid: { ...bidDoc.data(), status: payload.status }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitBid,
  getBidsByTender,
  getCompanyBids,
  updateBidStatus
};
