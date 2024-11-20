const { Notification, Group, User } = require('../db.js');

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
            attributes: ['id', 'name', 'accept'], // Atributos de las notificaciones
            include: [
                {
                    model: Group, // Asociación con el modelo de Grupo
                    attributes: ['id', 'name'], // Atributos del grupo
                    include: [
                        {
                            model: User, // Usuarios asociados al grupo
                            attributes: ['id', 'name', 'email'], // Atributos del usuario
                        },
                    ],
                },
            ],
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