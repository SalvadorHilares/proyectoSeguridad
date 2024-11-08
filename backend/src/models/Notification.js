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
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    groupKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};