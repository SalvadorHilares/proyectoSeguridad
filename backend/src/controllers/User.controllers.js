const crypto = require('crypto');
const { sendEmail } = require('../utils/email.service');
const { User, Group, Message } = require('../db.js');
const { Op } = require('sequelize');

const register = async (req, res) => {
    try {
        const { name, lastName, email, password } = req.body;

        // Check if the user already exists
        const user = await User.findOne({ where: { email : email } });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        // Create the user
        const newUser = await User.create({ name, lastName, email, password, publicKey, privateKey });

        // Generate token
        const token = newUser.generateToken();

        res.status(201).json({ token: token });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = user.generateToken();

        res.status(200).json({ token: token });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendEmailToGroup = async (req, res) => {
    try {
        // Extrae los datos del cuerpo de la solicitud
        const { userId, groupId, message } = req.body;

        // Busca el usuario y el grupo al que pertenece
        const user = await User.findOne({
            where: { id: userId },
            attributes: ['name', 'lastName', 'email', 'privateKey'],
            include: [{
                model: Group,
                as: 'groups',
                where: { id: groupId },
                attributes: ['name', 'groupKey']
            }]
        });

        // Verifica si el usuario y el grupo existen
        if (!user || !user.groups || user.groups.length === 0) {
            return res.status(404).json({ message: 'User or group not found' });
        }

        // Extrae los datos necesarios en variables individuales
        const { groupKey, name: groupName } = user.groups[0]; // Información del grupo
        const { name: userName, lastName: userLastName, email: userEmail, privateKey: userPrivateKey } = user; // Información del usuario

        // Cifra el mensaje usando la clave del grupo (AES-256-CBC)
        const cipher = crypto.createCipheriv(
            'aes-256-cbc',
            Buffer.from(groupKey, 'hex'), // Clave del grupo
            Buffer.alloc(16, 0) // Vector de inicialización (IV), configurado en 0
        );
        const encryptedMessage = cipher.update(message, 'utf8', 'hex') + cipher.final('hex');

        // Obtener a todos los usuarios del grupo menos al usuario que envía el mensaje
        const groupUsers = await User.findAll({
            include: [{
                model: Group,
                as: 'groups',
                where: { id: groupId }, // Asegúrate de filtrar por el grupo específico
                through: { attributes: [] } // Si usas una tabla intermedia para la asociación, excluye los atributos adicionales
            }],
            where: { id: { [Op.ne]: userId } } // Excluye al usuario que envía el mensaje
        });

        // Enviar el mensaje cifrado a todos los usuarios del grupo
        await Promise.all(groupUsers.map(async (groupUser) => {
            // Firmar el mensaje cifrado con la clave privada del remitente
            const userSignature = crypto.sign("sha256", Buffer.from(encryptedMessage), {
                key: userPrivateKey,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            });

            // Crear el mensaje en la base de datos
            await Message.create({
                text: encryptedMessage,
                userSignature: userSignature.toString('hex'),
                senderId: userId,
                receiverId: groupUser.id
            });

            // Enviar correo al usuario
            await sendEmail({
                from: { name: userName, lastName: userLastName, email: userEmail },
                to: { name: groupUser.name, lastName: groupUser.lastName, email: groupUser.email },
                subject: `Mensaje del grupo ${groupName}`,
                text: 'Mensaje cifrado',
                html: `<p>Recibiste un mensaje del grupo ${groupName}</p>`
            });
        }));

        res.status(200).json({ message: 'Email sent to group' });
    } catch (error) {
        console.error('Error sending email to group:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const receiveEmailFromGroup = async (req, res) => {
    try {
        const { messageId, receiverId, groupId } = req.body;

        // Buscar al usuario y la clave del grupo
        const user = await User.findOne({
            where: { id: receiverId },
            include: [{
                model: Group,
                as: 'groups',
                where: { id: groupId },
                attributes: ['groupKey']
            }]
        });

        // Buscar el mensaje y la clave pública del remitente
        const message = await Message.findOne({
            where: { id: messageId, state: 'NO VISTO' },
            include: [{ model: User, as: 'sender', attributes: ['publicKey'] }]
        });

        // Validar existencia de usuario, grupo y mensaje
        if (!user || !user.groups || !message) {
            return res.status(404).json({ message: 'User, group, or message not found' });
        }

        const { publicKey } = message.sender;
        const { groupKey } = user.groups[0];

        // Verificar firma del mensaje
        const isVerified = crypto.verify(
            "sha256",
            Buffer.from(message.text),
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING
            },
            Buffer.from(message.userSignature, 'hex')
        );

        if (!isVerified) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        // Descifrar el mensaje
        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            Buffer.from(groupKey, 'hex'),
            Buffer.alloc(16, 0) // Vector de inicialización (IV), configurado en 0
        );
        const decryptedMessage = decipher.update(message.text, 'hex', 'utf8') + decipher.final('utf8');

        // Marcar el mensaje como visto
        await message.update({ state: 'VISTO' });

        // Responder con el mensaje descifrado
        res.status(200).json({ message: decryptedMessage });
    } catch (error) {
        console.error('Error receiving email from group:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { 
    login,
    register,
    sendEmailToGroup,
    receiveEmailFromGroup
 };