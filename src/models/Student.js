const orm = require("../db");
const Sequelize = require("sequelize");
const Project = require("./Project");
const Student = orm.define(
  "students",
  {
    _id: {
      type: Sequelize.NUMBER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    surname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
Student.hasMany(Project, { foreignKey: "studentId" });
Project.belongsTo(Student, { foreignKey: "studentId" });

module.exports = Student;
