const { User, Notification, Group } = require('../db.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Servidor SMTP de MailerSend
  port: 465, // Usa el puerto 587 para TLS o 465 para SSL
  secure: true, // True si usas SSL, falso si usas TLS
  auth: {
    user: "shilaresbarrios@gmail.com", // Reemplaza con tu usuario SMTP
    pass: process.env.EMAIL_PASSWORD // Reemplaza con tu contraseña SMTP
  }
});

const sendEmail = async (admin, user, nameNotification, keyGroup) => {
  try {
    const mailOptions = {
      from: `"${admin.name} ${admin.lastname}" <${admin.email}>`, // Nombre y correo del remitente
      to: `${user.name} ${user.lastname} <${user.email}>`, // Nombre y correo del destinatario
      subject: `Invitación al Grupo ${nameNotification}`,
      text: `Your encrypted group key is: ${keyGroup}`,
      html: `<strong>Your encrypted group key is:</strong> <br> ${keyGroup}`
    };

    /*
    await Notification.create({
        userId: user.id,
        name: `Invitación al Grupo ${nameNotification}`,
        groupKey: keyGroup,
    });*/ 

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Error sending email via SMTP");
  }
};

const sendKeyGroup = async (req, res) => {
    try {
      const { adminEmail, usersEmail, nameNotification } = req.body;

      // Genera una clave de 256 bits para el grupo
      const groupKey = crypto.randomBytes(32).toString('hex');

      /*
      await Group.create({
        name: nameNotification,
        groupKey: groupKey,
      });*/

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
    } catch (error) {
      console.error("Error sending group key:", error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
};

const desecryptKeyGroup = async (req, res) => {
    try {
      const { userId, groupKey, isAccept } = req.body;

      if (!isAccept) {
        await Notification.update({ accept: "RECHAZADO" }, { where: { userId: userId, groupKey: groupKey } });
        return res.status(400).json({ message: 'User did not accept the invitation' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const group = await Group.findOne({ where: { groupKey: groupKey } });

      // Descifra la clave del grupo con la clave privada del usuario
      const decryptedGroupKey = crypto.privateDecrypt(
        {
          key: user.privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(groupKey, 'hex')
      );

      if (decryptedGroupKey.toString() !== group.groupKey) {
        return res.status(400).json({ message: 'Invalid group key' });
      }

      await user.addGroups(group);
      await Notification.update({ accept: "ACEPTADO" }, { where: { userId: userId, groupKey: groupKey } });

      res.status(200).json({ message: 'Invitation accepted' });
    } catch (error) {
      console.error("Error decrypting group key:", error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    sendKeyGroup,
    desecryptKeyGroup,
};
