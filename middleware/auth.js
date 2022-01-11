const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("authorization");
  //check token
  if (authHeader == null) {
    return res.status(401).json({ error: "Access-denied" });
  }
  //check validity
  try {
    const verified = jwt.verify(authHeader, process.env.SECRET_KEY);
    //If verify ok
    const user = jwt.decode(authHeader, process.env.SECRET_KEY);
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({
      error: "Invalid-token",
    });
  }
};
