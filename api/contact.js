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
      .query("SELECT * FROM salesforce.Contact WHERE sfid = $1", [id])
      .then((response) => {
        var contacts = response.rows[0];
        res.status(200).json(contacts);
      });
  } catch (error) {
    console.error(error.message);
  }
});

router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    var salutation = req.body.salutation;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var phone = req.body.phone;
    var password = req.body.password;

    client
      .query(
        "UPDATE salesforce.Contact SET salutation = $1, firstname = $2, lastname = $3, email = $4, phone = $5  WHERE sfid = $6",
        [salutation, firstname, lastname, email, phone, id]
      )
      .then((response) => {
        res.status(200).json({ message: "Firstname has been updated!" });
      });
  } catch (err) {
    console.error(err.message);
  }
});

router.patch("/update", (req, res) => {
  const query = {
    text: "UPDATE salesforce.Contact SET salutation = $1, firstname= $2, lastname= $3, email= $4, phone= $5, mailingstreet= $6, mailingcity= $7, mailingcountry= $8 WHERE sfid= $9",
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

router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    client
      .query(
        "UPDATE salesforce.Contact SET active__c = false WHERE sfid = $1",
        [id]
      )
      .then((response) => {
        res.status(200).json({ message: "Contact has been deactivate!" });
      });
  } catch (err) {
    console.error(err.message);
  }
});
module.exports = router;
