const { Message, User } = require("../db.js");

const getMessagesByUser = async (req, res) => {
    try {
        const { id } = req.user;
        const messages = await Message.findAll({ where: 
            { receiverId : id },
            attributes : ['id', 'state', 'groupId', 'senderId']
         });

        await Promise.all(messages.map(async (message) => {
            const sender = await User.findByPk(message.senderId, { attributes: ['name', 'lastName'] });
            message.dataValues.senderName = sender.name + ' ' + sender.lastName;
        }));
    
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMessagesByUser
};