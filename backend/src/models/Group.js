const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("group", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    groupKey: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
};