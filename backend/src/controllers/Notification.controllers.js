const { Notification, User } = require('../db.js');
const { Op } = require('sequelize');

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
    const { id } = req.user;

    try {
        const notifications = await Notification.findAll({
            where: { userId: id },
            attributes: ['id', 'name', 'accept']
        });

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error getting notifications by user:", error.message);
        res.status(500).json({ message: "Error getting notifications by user" });
    }
};

const getUsersByNotification = async (req, res) => {
    const { id } = req.user;
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findByPk(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        // notification.groupId : Ahora quiero obtener los usuarios que no sean el usuario actual y que pertenezcan al grupo de la notificación

        const users = await Notification.findAll({
            where: {
                userId: { [Op.ne]: id },
                groupId: notification.groupId
            },
            include: {
                model: User,
                attributes: ['id', 'name', 'lastName']
            },
            attributes: ['name', 'accept']
        });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting users by notification:", error.message);
        res.status(500).json({ message: "Error getting users by notification" });
    }
}

module.exports = {
    getNotifications,
    getNotificationsByUser,
    getUsersByNotification
};