const express = require("express");
const Student = require("../../models/Student");
const router = express.Router();
const Sequelize = require("sequelize");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const { query } = req;

      const page = query.page;
      delete query.page;
      let querySql = {};
      let params = [];
      for (let key in query) {
        params.push(query[key]);
        querySql[key] = { [Sequelize.Op.iLike]: `%${query[key]}%` };
      }
      let result = await Student.findAll({
        where: { ...querySql },
        limit: 1,
        offset: 1 * page,
      });
      let numberOfStudent = await Student.findAndCountAll();
      console.log(numberOfStudent);
      res.send({
        data: result,
        currentPage: page,
        pageCount: Math.ceil(parseInt(numberOfStudent.count) / 1),
        results: parseInt(numberOfStudent.count),
      });
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
