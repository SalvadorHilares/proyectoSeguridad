const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
const { User, Notification, Group } = require('../db.js');
const crypto = require('crypto');

const mailerSend = new MailerSend({
    apiKey: process.env.API_KEY,
});

const sendEmail = async (admin, user, nameNotification, keyGroup) => {
    try {
      const sentFrom = new Sender(admin.email, admin.name + " " + admin.lastname);

      const recipients = [
          new Recipient(user.email, user.name + " " + user.lastname)
        ];

        await Notification.create({
          userId: user.id,
          name: "Invitación al Grupo " + nameNotification,
          groupKey: keyGroup,
        });
        
        const emailParams = new EmailParams()
          .setFrom(sentFrom)
          .setTo(recipients)
          .setReplyTo(sentFrom)
          .setSubject("Invitación al Grupo " + nameNotification)
          .setHtml(`<strong>Your encrypted group key is:</strong> <br> ${keyGroup}`)
          .setText(`Your encrypted group key is: ${keyGroup}`);
        
        await mailerSend.email.send(emailParams);
        console.log("Email sent successfully");
    } catch (error) {
      console.error("This error cause by: ",error.message);
      throw new Error("Error sending email");
    }
};

const sendKeyGroup = async (req, res) => {
    // El nameNotification es el nombre parcial del nombre del grupo que se creará
    const {adminEmail, usersEmail, nameNotification} = req.body

    const groupKey = crypto.generateKey('aes', {
        length: 256
    });

    await Group.create({
      name: nameNotification,
      groupKey: groupKey
    });

    const admin = await User.findOne({ email: adminEmail });
    
    usersEmail.forEach(async (email) => {
      const user = await User.findOne({ email: email});
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      // Cifrando la key grupal con la clave publica del usuario y hasheando con sha256
      const cifrateGroupKeyWithPublicKey = crypto.publicEncrypt(
        {
          key: user.publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(groupKey)
      );

      // Cifrando la key grupal con la clave privada del admin
      const cifrateGroupKeyWithPrivateKeyAdmin = crypto.privateEncrypt(
        {
          key: admin.privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        },
        Buffer.from(cifrateGroupKeyWithPublicKey)
      );

      sendEmail(admin, user, nameNotification, cifrateGroupKeyWithPrivateKeyAdmin.toString('hex'));
    });
};

module.exports = {
    sendKeyGroup
};