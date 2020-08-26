const express = require("express");
const User = require("../../models/Auth");
const Sequelize = require("sequelize");
const router = express.Router();

router.route("/signUp").post(async (req, res, next) => {
  User.create(req.body)
    .then((user) => res.send(user._id))
    .catch((e) => res.send(e));
});

module.exports = router;
