const config = require("../config/zoomconfig");
const jwt = require("jsonwebtoken");

const payload = {
  iss: config.APIKey,
  exp: Math.floor(Date.now() / 1000) + 60 * 60,
};

const token = jwt.sign(payload, config.APISecret);
function addToken(req, res, next) {
  req.body["token"] = token;
  next();
}

module.exports = { addToken };
