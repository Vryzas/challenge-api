const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./../utils/dbconnection');

class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      inique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      isEmail: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: false,
  }
);

User.sync({ alter: true });
console.log(User === sequelize.models.User);
module.exports = User;
