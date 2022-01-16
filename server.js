const express = require("express");
//const bodyParser = require("body-parser");
const path = require("path");
const app = express();
//Config client environnement
const client = require("./config/database");
require("dotenv").config();
const signRoutes = require("./api/sign");
const contactRoutes = require("./api/contact");
const contractRoutes = require("./api/contract");
const productRoutes = require("./api/product");

//Parse JSON bodies (as sent by API clients)
app.use(express.json());
//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

//Path www
app.use(express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//Allow Header Controls
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

//Connect Postgres db
client
  .connect()
  .then(() => console.log("Heroku db connected"))
  .catch((err) => console.error("connection error", err.stack));

//Routes API

app.use("/api/sign", signRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/contract", contractRoutes);
app.use("/api/product", productRoutes);

//Listening Server Port
app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});
