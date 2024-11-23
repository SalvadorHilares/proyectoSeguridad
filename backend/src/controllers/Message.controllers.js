const { Message } = require("../db.js");

const getMessagesByUser = async (req, res) => {
    try {
        const { id } = req.user;
        const messages = await Message.findAll({ where: 
            { receiverId : id },
            attributes : ['id', 'state']
         });
    
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMessagesByUser
};