const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!!token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json("token_not_valid");
      } else {
        req.decoded = decoded;

        const expiresIn = 24 * 60 * 60;
        const newToken = jwt.sign(
          {
            user: decoded.user,
          },
          SECRET_KEY,
          {
            expiresIn: expiresIn,
          }
        );

        res.header("Authorization", "Bearer " + newToken);
        next();
      }
    });
  } else {
    return res.status(401).json("token_required");
  }
};

/*    
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
*/
