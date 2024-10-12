const express = require("express");
const User = require("../models/user");
const { validateSignup } = require("../utils/validation");
const bcrypt = require("bcryptjs");

const router = express.Router();
// auth router

// signup
router.post("/signup", async (req, res) => {
  // validation

  try {
    validateSignup(req);
    // hash the password
    let { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    req.body.password = passwordHash;
    const userObj = new User(req.body); // Create a new instance
    await userObj.save();
    res.status(201).send(userObj);
  } catch (error) {
    res.status(400).send({ error: "Error saving user" + error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid email");
    }
    const isCorrectPassword = await user.validatePassword(password);
    if (isCorrectPassword) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.status(200).send("User is logged In");
    } else {
      throw new Error("Invalid email or password ");
    }
  } catch (error) {
    res.status(400).send("" + error);
  }
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send("User logged out Sucessfullyy..........");
  } catch (error) {
    res.status(400).send("" + error);
  }
});

module.exports = router;
