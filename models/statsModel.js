const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/dbconnection');
const User = require('./userModel');

class Stat extends Model {}

Stat.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: User,
        key: 'username',
      },
    },
    victories: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    defeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    draws: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Stat',
    timestamps: false,
  }
);

Stat.sync();
module.exports = Stat;
