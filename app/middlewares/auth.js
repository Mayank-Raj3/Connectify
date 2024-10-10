const User = require("../models/user");
var jwt = require("jsonwebtoken");
const { SALT } = require("../config/config");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Token is not valid");

    const decodedObj = await jwt.verify(token, SALT);
    const { userId } = decodedObj;
    const user = await User.findById(userId);
    if (!user) throw new Error("user  not found");

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error" + error);
  }
};

module.exports = { userAuth };
