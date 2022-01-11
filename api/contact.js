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

router.post("/login", (req, res) => {
  try {
    client
      .query(
        "SELECT * FROM salesforce.Contact where password__c=$1 AND email=$2",
        [req.body.password, req.body.email]
      )
      .then((data) => {
        let contacts = data.rows[0];
        //console.log(contacts.sfid, contacts.password, contacts.email);
        //console.log(data.rows);
        const token = jwt.sign(contacts, SECRET_KEY, {
          expiresIn: 24 * 60 * 60,
        });
        console.log(token);
        res.status(200).json(contacts);
      });
  } catch (error) {
    res.status(500);
    console.log(error);
  }
});

router.post("/register", (req, res) => {
  try {
    client
      .query(
        "INSERT INTO salesforce.Contact (Salutation, FirstName, LastName, Email, Password__c) VALUES ($1, $2, $3, $4, $5)  RETURNING *",
        [
          req.body.salutation,
          req.body.firstname,
          req.body.lastname,
          req.body.email,
          req.body.password,
        ]
      )
      .then((data) => {
        let contacts = data.rows[0];
        console.log(contacts);
        res.status(201).json(contacts);
      });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log({ message: error });
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

module.exports = router;
