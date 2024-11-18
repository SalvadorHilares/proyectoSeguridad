const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
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

  // Hook para cifrar la contraseña antes de guardar el usuario
  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  // Método de instancia para comparar contraseñas
  User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  // Método de instancia para generar token
  User.prototype.generateToken = function () {
    const payload = { id: this.id, email: this.email }; // Información que quieras incluir en el token
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  };

  return User;
};
