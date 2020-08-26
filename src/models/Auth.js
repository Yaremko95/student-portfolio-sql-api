const orm = require("../db");
const Sequelize = require("sequelize");
const Moment = require("moment");
const User = orm.define(
  "users",
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async function (user, options, cb) {
        const salt = await bcrypt.genSalt(12);
        await bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          return cb(null, options);
        });
      },
      beforeUpdate: async function (user, options, cb) {
        const salt = await bcrypt.genSalt(12);
        await bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          return cb(null, options);
        });
      },
    },
    getterMethods: {
      createdAt: function getCreadtedAt() {
        return Moment(this.getDataValue("createdAt")).format(
          "DD/MM/YYYY HH:mm:ss"
        );
      },
      updatedAt: function getCreadtedAt() {
        return Moment(this.getDataValue("updatedAt")).format(
          "DD/MM/YYYY HH:mm:ss"
        );
      },
    },
  }
);
User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
