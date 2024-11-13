const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("notification", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accept: {
      type: DataTypes.ENUM("ACEPTADO", "ESPERA", "RECHAZADO"),
      allowNull: false,
      defaultValue: "ESPERA",
    },
    groupKey: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });
};