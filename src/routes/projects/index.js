const express = require("express");
const Project = require("../../models/Project");
const Student = require("../../models/Student");
const router = express.Router();
const Sequelize = require("sequelize");

router
  .route("/")
  .get(async (req, res) => {
    try {
      let result = await Project.findAll({
        include: Student,
      });

      res.send({
        data: result,
      });
    } catch (e) {
      console.log(e);
      res.status(404).send(e);
    }
  })
  .post(async (req, res) => {
    try {
      let result = await Project.create(req.body);
      res.send(result);
    } catch (e) {
      console.log(e);
      res.status(404).send(e);
    }
  });
router
  .route("/:id")
  .get(async (req, res) => {
    try {
      res.send({
        data: await Project.findOne({
          where: {
            _id: req.params.id,
          },
          //include: Student,
        }),
      });
    } catch (e) {
      console.log(e);
      res.status(404).send(e);
    }
  })
  .put(async (req, res) => {
    try {
      delete req.body._id;
      res.send(
        await Project.update(
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
      let result = await Project.destroy({
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
