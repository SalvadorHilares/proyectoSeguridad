const { User, Notification, Group } = require('../db.js');
const { sendEmail } = require('../utils/email.service.js');
const crypto = require('crypto');

// Envía invitaciones a los usuarios para unirse a un grupo
const sendGroupInvitationEmail = async (admin, user, nameNotification, notificationId) => {
  const subject = `Invitación al Grupo ${nameNotification}`;
  const text = `You have been invited to join the group ${nameNotification}. Please accept or decline the invitation.`;
  const html = `
    <p>You have been invited to join the group <strong>${nameNotification}</strong>.</p>
    <p><a href="http://localhost:3000/group/${notificationId}">Click here to accept or decline the invitation</a></p>
  `;

  await sendEmail({
    from: admin,
    to: user,
    subject,
    text,
    html
  });
};

// Envía un correo encriptado al aceptar la invitación
const sendAcceptanceConfirmationEmail = async (admin, user, groupName) => {
  const message = `El usuario ${user.name} aceptó la invitación al grupo ${groupName}.`;

  // Cifra el mensaje con la clave pública del administrador
  const encryptedMessage = crypto.publicEncrypt(
    {
      key: admin.publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256"
    },
    Buffer.from(message)
  );

  const subject = `Confirmación de Aceptación - Grupo ${groupName}`;
  const text = `The acceptance confirmation message is: ${encryptedMessage.toString('hex')}`;
  const html = `<strong>The acceptance confirmation message is:</strong> <br> ${encryptedMessage.toString('hex')}`;

  await sendEmail({
    from: user,
    to: admin,
    subject,
    text,
    html
  });
};

// Función para enviar la clave del grupo
const sendKeyGroup = async (req, res) => {
  try {
    const { adminEmail, usersEmail, nameNotification } = req.body;

    const admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const groupKey = crypto.randomBytes(32).toString('hex');

    await Group.create({
      name: nameNotification,
      groupKey: groupKey,
    });

    for (const emailObj of usersEmail) {
      const user = await User.findOne({ where: { email: emailObj.email } });
      if (!user) {
        console.error(`User ${emailObj.email} not found`);
        continue;
      }

      const encryptedGroupKey = crypto.publicEncrypt(
        {
          key: user.publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(groupKey)
      );

      const adminSignature = crypto.sign("sha256", Buffer.from(encryptedGroupKey), {
        key: admin.privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      });

      const notification = await Notification.create({
        adminId: admin.id,
        userId: user.id,
        name: `Invitación al Grupo ${nameNotification}`,
        groupKey: encryptedGroupKey.toString('hex'),
        adminSignature: adminSignature.toString('hex'),
      });

      await sendGroupInvitationEmail(admin, user, nameNotification, notification.id);
    }

    res.status(200).json({ message: 'Group key sent to all users' });
  } catch (error) {
    console.error("Error sending group key:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Procesa la aceptación de la invitación por parte del usuario
const desecryptKeyGroup = async (req, res) => {
  try {
    const { notificationId, userId, isAccept } = req.body;

    if (!isAccept) {
      await Notification.update(
        { accept: "RECHAZADO" },
        { where: { id: notificationId, userId: userId } }
      );
      return res.status(400).json({ message: 'User did not accept the invitation' });
    }

    const notification = await Notification.findOne({
      where: { id: notificationId, userId: userId },
      include: [{ model: User, as: 'admin' , attributes: ['name', 'lastName', 'email', 'publicKey'] }]
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.accept === "ACEPTADO") {
      return res.status(400).json({ message: 'User already accepted the invitation' });
    }

    const { groupKey, adminSignature, admin } = notification;

    const isVerified = crypto.verify(
      "sha256",
      Buffer.from(groupKey, 'hex'),
      {
        key: admin.publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      Buffer.from(adminSignature, 'hex')
    );

    if (!isVerified) {
      return res.status(400).json({ message: 'Invalid admin signature' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const decryptedGroupKey = crypto.privateDecrypt(
      {
        key: user.privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(groupKey, 'hex')
    );

    const group = await Group.findOne({ where: { groupKey: decryptedGroupKey } });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    await user.addGroups(group);

    await Notification.update(
      { accept: "ACEPTADO" },
      { where: { id: notificationId, userId: userId } }
    );

    await sendAcceptanceConfirmationEmail(admin, user, group.name);

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
