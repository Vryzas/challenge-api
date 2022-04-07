const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/dbconnection');
const User = require('./userModel');

class Match extends Model {}

Match.init(
  {
    // id: {
    //   type: DataTypes.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true,
    // },
    game: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    username1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    username2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    score1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    score2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    // winner: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: User,
    //     key: 'id',
    //   },
    // },
  },
  {
    sequelize,
    modelName: 'Match',
    timestamps: false,
  }
);

Match.sync({ alter: true });
console.log(Match === sequelize.models.Match);
module.exports = Match;
