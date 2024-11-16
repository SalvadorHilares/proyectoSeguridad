const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("message", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.ENUM("VISTO", "NO VISTO"),
      allowNull: false,
      defaultValue: "NO VISTO",
    },
    userSignature: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
};