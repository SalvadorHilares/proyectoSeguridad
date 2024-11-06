import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
const User = require('../db.js');
const crypto = require('crypto');

const mailerSend = new MailerSend({
    apiKey: process.env.API_KEY,
});

const sendEmail = async (req, res) => {
    try {
      const sentFrom = new Sender("you@yourdomain.com", "Your name");

      const recipients = [
          new Recipient("your@client.com", "Your Client")
        ];
        
        const emailParams = new EmailParams()
          .setFrom(sentFrom)
          .setTo(recipients)
          .setReplyTo(sentFrom)
          .setSubject("This is a Subject")
          .setHtml("<strong>This is the HTML content</strong>")
          .setText("This is the text content");
        
        await mailerSend.email.send(emailParams);
    } catch (error) {
      console.error("This error cause by: ",error.message);
      res.status(500).json({ message: error.message });
    }
};

const sendKeyGroup = async (req, res) => {
    const {adminEmail, usersEmail} = req.body

    const groupKey = crypto.generateKey('aes', {
        length: 256
    });

    const admin = await User.findOne({ email: adminEmail });
    
    usersEmail.forEach(async (email) => {
      const user = await User.findOne({ email});
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
        Buffer.from(groupKey)
      );

      sendEmail(cifrateGroupKeyWithPublicKey, cifrateGroupKeyWithPrivateKeyAdmin);
    });
};