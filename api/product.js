const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const client = require("../config/database");
//require("dotenv").config();

// get /api/contract
router.get("/", auth, (req, res) => {
  return res.status(200).json("NON LOGGED");
});

router.post("/getProduct", auth, (req, res) => {
  //Query to retrieve the products details where pricebook is Legarant pricebook
  const query = {
    text: "SELECT productcode, name, unitprice from salesforce.PriceBookEntry where pricebook2id=$1 order by name",
    values: [process.env.PRICEBOOK_LEGARANT],
  };
  client
    .query(query)
    .then((response) => {
      res.status(200).json(response.rows);
      //console.log(response.rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
      console.log({ message: err });
    });
});

module.exports = router;
