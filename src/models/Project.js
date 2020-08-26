const orm = require("../db");
const Sequelize = require("sequelize");
const Student = require("./Student");
const Project = orm.define(
  "projects",
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
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    liveUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    repoUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    studentId: {
      type: Sequelize.NUMBER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
// Project.belongsTo(Student, { foreignKey: "studentId" });
// Student.hasMany(Project, { foreignKey: "studentId" });
// Project.belongsTo(Student, { foreignKey: "studentId" });
//Student.hasMany(Project);
// Project.belongsTo(Student, { foreignKey: "studentId" });

module.exports = Project;
