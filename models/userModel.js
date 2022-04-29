const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./../utils/dbconnection");

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
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      isEmail: true,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
    logedIn: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    modelName: "User",
    timestamps: false,
  }
);

User.sync({ alter: true });
module.exports = User;
