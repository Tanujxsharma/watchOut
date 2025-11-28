const { firestore } = require('../config/firebase');
const { nanoid } = require('nanoid');

// Internal helper to create a notification
const createNotification = async (userId, title, message, type = 'info') => {
  try {
    const notificationId = nanoid(10);
    const timestamp = new Date().toISOString();

    await firestore.collection('notifications').doc(notificationId).set({
      id: notificationId,
      userId,
      title,
      message,
      type, // info, success, warning, error
      read: false,
      createdAt: timestamp
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const snapshot = await firestore.collection('notifications')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const notifications = [];
    snapshot.forEach(doc => notifications.push(doc.data()));

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notificationRef = firestore.collection('notifications').doc(id);
    const doc = await notificationRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (doc.data().userId !== req.user.uid) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await notificationRef.update({ read: true });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead
};
