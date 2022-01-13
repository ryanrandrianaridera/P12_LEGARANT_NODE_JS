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

router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    client
      .query("SELECT * FROM salesforce.Contact WHERE id = $1", [id])
      .then((contact) => {
        res.json(contact.rows[0]);
      });
  } catch (error) {
    console.error(error.message);
  }
});

router.patch("/update", (req, res) => {
  const query = {
    text: "UPDATE salesforce.Contact SET salutation = $1, firstname= $2, lastname= $3, email= $4, phone= $5, mailingstreet= $6, mailingcity= $7, mailingcountry= $8 WHERE id= $9",
    values: [
      req.body.salutation,
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      req.body.phone,
      req.body.mailingstreet,
      req.body.mailingcity,
      req.body.mailingcountry,
      req.body.sfid,
    ],
  };
  client
    .query(query)
    .then((response) => {
      res.status(200).json({
        message: "Informations updated!",
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.patch("/update/:sfid", (req, res) => {
  try {
    var sfid = req.params.sfid;
    console.log("BEFORE QUERY SFID: " + sfid);
    client
      .query(
        "UPDATE salesforce.Contact SET salutation = $2, firstname= $3, lastname= $4, email= $5, phone= $6, mailingstreet= $7, mailingcity= $8, mailingcountry= $9 WHERE sfid= $1 RETURNING firstname",
        [
          sfid,
          req.body.salutation,
          req.body.firstName,
          req.body.lastname,
          req.body.email,
          req.body.phone,
          req.body.mailingstreet,
          req.body.mailingcity,
          req.body.mailingcountry,
        ]
      )
      .then((contact) => {
        res.json(contact.rows[0]);
      });
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
