const { Notification } = require('../db.js');

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        res.json(notifications);
    } catch (error) {
        console.error("Error getting notifications:", error.message);
        res.status(500).json({ message: "Error getting notifications" });
    }
};

const getNotificationsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const notifications = await Notification.findAll({
            where: { userId: userId },
        });
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error getting notifications by user:", error.message);
        res.status(500).json({ message: "Error getting notifications by user" });
    }
};

module.exports = {
    getNotifications,
    getNotificationsByUser,
};