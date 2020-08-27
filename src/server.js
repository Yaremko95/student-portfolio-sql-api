const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const passRouter = require("./passport");

const sequelize = require("./db/index");
const studentsRouter = require("./routes/students");
const projectsRouter = require("./routes/projects");
const authRouter = require("./routes/auth");

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use("/auth", authRouter);
app.use("/students", studentsRouter);
app.use("/projects", projectsRouter);

app.listen(process.env.PORT, () => {
  console.log("running");
});
