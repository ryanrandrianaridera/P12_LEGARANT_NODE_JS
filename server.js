const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//Parse JSON bodies (as sent by API clients)
app.use(express.json());
//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

const client = require("./config/database");
//const jwt = require("jsonwebtoken");
require("dotenv").config();
//const SECRET_KEY = process.env.SECRET_KEY;

app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Select Server Port
app.set("port", process.env.PORT || 3000);

//connexion to postgres db

client
  .connect()
  .then(() => console.log("Heroku db connected"))
  .catch((err) => console.error("connection error", err.stack));

const signRoutes = require("./api/sign");
app.use("/api/sign", signRoutes);
const contactRoutes = require("./api/contact");
app.use("/api/contact", contactRoutes);
const contractRoutes = require("./api/contract");
app.use("/api/contract", contractRoutes);
const productRoutes = require("./api/product");
app.use("/api/product", productRoutes);

app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});
