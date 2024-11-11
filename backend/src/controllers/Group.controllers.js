const nodemailer = require('nodemailer');
const { User, Notification, Group } = require('../db.js');
const crypto = require('crypto');

const sendEmail = async (admin, user, nameNotification, keyGroup) => {
  try {
      // Crea el transporter utilizando un servicio SMTP. Aquí te muestro un ejemplo con Gmail.
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'adriana37@ethereal.email',
            pass: 'Sjr7ha1mGRzbQFKkQA'
        }
    });

      // Configura los detalles del correo
      const mailOptions = {
          from: 'adriana37@ethereal.email',  // Remitente: el admin
          to: `satorugojokun45@gmail.com`,  // Destinatario: el usuario
          subject: `Invitación al Grupo ${nameNotification}`,  // Asunto
          text: `Your encrypted group key is: ${keyGroup}`,  // Texto plano
          html: `<strong>Your encrypted group key is:</strong> <br> ${keyGroup}`,  // HTML del correo
      };

      // Guardar notificación en la base de datos
      await Notification.create({
          userId: user.id,
          name: `Invitación al Grupo ${nameNotification}`,
          groupKey: keyGroup,
      });

      // Enviar el correo
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);
  } catch (error) {
      // Manejo de errores
      console.error("Error sending email:", error.message);
      throw new Error("Error sending email");
  }
};

const sendKeyGroup = async (req, res) => {
    const { adminEmail, usersEmail, nameNotification } = req.body;

    // Genera una clave de 256 bits para el grupo
    const groupKey = crypto.randomBytes(32).toString('hex');

    await Group.create({
        name: nameNotification,
        groupKey: groupKey,
    });

    const admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
        return res.status(404).json({ message: 'Admin user not found' });
    }

    for (const emailObj of usersEmail) {
        const user = await User.findOne({ where: { email: emailObj.email } });
        if (!user) {
            console.error(`User ${emailObj.email} not found`);
            continue;
        }

        // Cifra la clave del grupo con la clave pública del usuario y con sha256
        const encryptedGroupKey = crypto.publicEncrypt(
            {
                key: user.publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            Buffer.from(groupKey)
        );

        // Envía el correo al usuario
        await sendEmail(
            admin,
            user,
            nameNotification,
            encryptedGroupKey.toString('hex')
        );
    }

    res.status(200).json({ message: 'Group key sent to all users' });
};

module.exports = {
    sendKeyGroup,
};
