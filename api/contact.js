const express = require("express");
const router = express.Router();
const client = require("../config/database");
const auth = require("../middleware/auth");
//require("dotenv").config();

// get /api/contact
router.get("/", auth, (req, res) => {
  const query = {
    text: "SELECT Salutation, FirstName, LastName, Email, Password__c from salesforce.Contact where sfid=$1",
    values: [req.decoded.sfid],
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

router.get("/:id", auth, (req, res) => {
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

router.put("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    var salutation = req.body.salutation;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var phone = req.body.phone;
    // var password = req.body.password;

    client
      .query(
        "UPDATE salesforce.Contact SET salutation = $1, firstname = $2, lastname = $3, email = $4, phone = $5  WHERE sfid = $6",
        [salutation, firstname, lastname, email, phone, id]
      )
      .then((response) => {
        res.status(200).json({ message: "Contact has been updated!" });
      });
  } catch (err) {
    console.error(err.message);
  }
});

router.patch("/update", auth, (req, res) => {
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
      req.decoded.sfid,
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

router.delete("/:id", auth, (req, res) => {
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
