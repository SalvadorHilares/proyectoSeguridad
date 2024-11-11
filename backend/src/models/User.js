const { DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");

module.exports = (sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicKey: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    privateKey: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  // Agrega el método de instancia generateToken
  User.prototype.generateToken = function () {
    const payload = { id: this.id, email: this.email }; // Información que quieras incluir en el token
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); // Genera el token
  };

  return User;
};
