const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./../utils/dbconnection');

class User extends Model {}

User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
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
