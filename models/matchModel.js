const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/dbconnection');
const User = require('./userModel');

class Match extends Model {}

Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    game: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username1: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: 'username',
      },
    },
    username2: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: 'username',
      },
    },
    score1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    score2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Match',
    updatedAt: false,
  }
);

Match.sync({ alter: true });
module.exports = Match;
