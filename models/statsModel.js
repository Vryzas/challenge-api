const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/dbconnection');
const User = require('./userModel');

class Stat extends Model {}

Stat.init(
  {
    // id: {
    //   type: DataTypes.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true,
    // },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    victories: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    defeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    draws: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
  },
  {
    sequelize,
    modelName: 'Stat',
    timestamps: false,
  }
);

Stat.sync({ alter: true });
console.log(Stat === sequelize.models.Stat);
module.exports = Stat;
