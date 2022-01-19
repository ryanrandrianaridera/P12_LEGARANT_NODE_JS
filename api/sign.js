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
        res.header("Authorization", "Bearer " + token);
        console.log(token);
        return res.status(200).json(contacts);
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

module.exports = router;
