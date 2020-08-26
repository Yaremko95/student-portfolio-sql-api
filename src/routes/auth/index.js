const express = require("express");
const User = require("../../models/Auth");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.route("/signUp").post(async (req, res, next) => {
  User.create({ ...req.body, refresh_tokens: [] })
    .then((user) => res.send({ _id: user._id }))
    .catch((e) => res.send(e));
});

router.route("/login").post(async (req, res, next) => {
  User.findOne({ where: { username: req.body.username } }).then(
    async (user) => {
      if (!user) {
        res.status(401).send("invalid username");
      } else if (!user.validPassword(req.body.password)) {
        res.status(401).send("invalid password");
      } else {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: 300,
        });
        const refreshToken = jwt.sign(
          { _id: user._id },
          process.env.REFRESH_JWT_KEY,
          {
            expiresIn: "1 week",
          }
        );
        console.log(user);
        user.refresh_tokens = user.refresh_tokens.concat(refreshToken);
        await User.update(
          { refresh_tokens: user.refresh_tokens },
          { where: { _id: user._id } }
        );
        res.send({ token, refreshToken });
      }
    }
  );
});

module.exports = router;
