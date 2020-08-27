const orm = require("../db");
const Sequelize = require("sequelize");
const Moment = require("moment");
const bcrypt = require("bcrypt");
const User = orm.define(
  "users",
  {
    _id: {
      type: Sequelize.NUMBER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: function (value) {
        if (value === null && this.googleid === null) {
          throw new Error("Please provide password");
        }
      },
    },
    refresh_tokens: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      defaultValue: [],
    },
    googleid: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    hooks: {
      beforeCreate: async function (user) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async function (user) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }

  // getterMethods: {
  //   createdAt: function getCreadtedAt() {
  //     return Moment(this.getDataValue("createdAt")).format(
  //       "DD/MM/YYYY HH:mm:ss"
  //     );
  //   },
  //   updatedAt: function getCreadtedAt() {
  //     return Moment(this.getDataValue("updatedAt")).format(
  //       "DD/MM/YYYY HH:mm:ss"
  //     );
  //   },
  // },
);
User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
