const { Message } = require("../db.js");

const getMessages = async (req, res) => {
    try {
        const messages = await Message.findAll();
    
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMessagesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const messages = await Message.findAll({ where: { receiverId : userId } });
    
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMessages,
    getMessagesByUser
};