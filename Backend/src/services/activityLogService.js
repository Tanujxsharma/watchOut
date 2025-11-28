const { firestore } = require('../config/firebase');

async function logActivity({
  action,
  performedBy,
  targetUser,
  details = {}
}) {
  const docRef = firestore.collection('activityLogs').doc();
  const payload = {
    id: docRef.id,
    action,
    performedBy,
    targetUser: targetUser || null,
    details,
    timestamp: new Date().toISOString()
  };
  await docRef.set(payload);
  return payload;
}

module.exports = {
  logActivity
};

