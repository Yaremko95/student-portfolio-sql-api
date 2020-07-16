const express = require("express");
const Student = require("../models/Student");
const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      res.send(await Student.findAll());
    } catch (e) {
      console.log(e);
      res.status(404).send(e);
    }
  })
  .post(async (req, res) => {
    try {
      res.send(await Student.create(req.body));
    } catch (e) {
      console.log(e);
      res.status(404).send(e);
    }
  });
router
  .route("/:id")
  .get(async (req, res) => {
    try {
      res.send(
        await Student.findOne({
          where: {
            _id: req.params.id,
          },
        })
      );
    } catch (e) {
      console.log(e);
      res.status(404).send(e);
    }
  })
  .put(async (req, res) => {
    try {
      delete req.body._id;
      res.send(
        await Student.update(
          { ...req.body },
          {
            where: {
              _id: req.params.id,
            },
          }
        )
      );
    } catch (e) {
      console.log(e);
      res.status(404).send(e);
    }
  })
  .delete(async (req, res) => {
    try {
      let result = await Student.destroy({
        where: {
          _id: req.params.id,
        },
      });
      console.log(result);
      if (result === 1) res.send("ok");
      res.status(404).send("not found");
    } catch (e) {
      console.log(e);
      res.status(404).send(e);
    }
  });

module.exports = router;
