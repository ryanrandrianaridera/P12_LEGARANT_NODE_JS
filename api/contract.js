const express = require("express");
const router = express.Router();
const client = require("../config/database");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

// get /api/contract
router.get("/", (req, res) => {
  return res.status(200).json("NON LOGGED");
});

router.get("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    client
      .query(
        "SELECT contractnumber, startdate, enddate, contractterm from salesforce.Contract where sfid=$1",
        [id]
      )
      .then((response) => {
        var contracts = response.rows[0];
        if (contracts !== undefined) {
          res.status(200).json(contracts);
        } else {
          res
            .status(200)
            .json({ message: "Il n'y a pas de contrat pour ce contact!" });
        }
      });
  } catch (error) {
    console.error(error.message);
  }
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
