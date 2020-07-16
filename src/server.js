const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./db/index");
const studentsRouter = require("./students");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/students", studentsRouter);

app.listen(process.env.PORT, () => {
  console.log("running");
});
