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

router.route("/token").post(async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_KEY);
    const user = await User.findOne({ where: { _id: decoded._id } });
    if (!user) res.status(401);
    else {
      const currentToken = user.refresh_tokens.find(
        (token) => token === refreshToken
      );
      if (!currentToken) res.status(401);
      else {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: 300,
        });
        const refreshToken = jwt.sign(
          { _id: user._id },
          process.env.REFRESH_JWT_KEY,
          { expiresIn: "1 week" }
        );
        user.refresh_tokens = user.refresh_tokens
          .filter((token) => token !== currentToken)
          .concat(refreshToken);
        await User.update(
          { refresh_tokens: user.refresh_tokens },
          { where: { _id: user._id } }
        );
        res.send({ token, refreshToken });
      }
    }
  } else {
    res.status(401);
  }
});
module.exports = router;
