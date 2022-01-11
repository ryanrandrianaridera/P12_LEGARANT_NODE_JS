const express = require("express");
const router = express.Router();
const test = require("../middleware/auth");
const client = require("../config/database");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

// get /api/contract
router.get("/", (req, res) => {
  return res.status(200).json("NON LOGGED");
  const query = {
    text: "SELECT contractnumber, startdate, enddate, contractterm from salesforce.Contract where customersignedid=$1",
    values: [req.user.sfid],
  };

  client
    .query(query)
    .then((response) => {
      res.status(200).json(response.rows[0]);
      console.log(response.rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
      console.log({ message: err });
    });
});

router.post("/getContract", (req, res) => {
  const query = {
    text: "SELECT contractnumber, startdate, enddate, contractterm from salesforce.Contract where customersignedid=$1",
    values: [req.body.sfid],
  };
  client
    .query(query)
    .then((response) => {
      res.status(200).json(response.rows[0]);
      //console.log(response.rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
      console.log({ message: err });
    });
});

module.exports = router;
