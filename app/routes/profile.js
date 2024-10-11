const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfile } = require("../utils/validation");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  const data = req.body;
  const userId = req.user._id;
  const userIdString = userId.toString();
  try {
    if (!validateEditProfile(data)) throw new Error("Update Not allowed");

    await User.findByIdAndUpdate(userIdString, data, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(201).send("User Successfully Updated");
  } catch (error) {
    res.status(500).send("Error Updating the data " + error.message);
  }
});

router.patch("/profile/password", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });

    if (!user) throw new Error("User not found");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const data = await User.findByIdAndUpdate(user._id, {
      password: password,
    });
    res.status(201).json({ message: "User password successfully updated" });
  } catch (error) {
    res.status(500).send("Error updating the data: " + error.message);
  }
});

/*
// getUsersByEmail
app.get("/user", async (req, res) => {
  try {
    const data = await User.findOne({ emailId: req.body.emailId });
    if (!data) {
      res.send("No user found");
    }
    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching the data ");
  }
});

// getAllusers
app.get("/user", async (req, res) => {
  try {
    const data = await User.find();
    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching the data ");
  }
});

// deleteByuserId
app.delete("/user", async (req, res) => {
  console.log("hit");
  try {
    const data = await User.findByIdAndDelete({ _id: req.body.userId });
    if (!data) {
      res.send("No user found");
    }
    res.send("User data deleted Sucessfully...");
  } catch (error) {
    res.status(500).send("Error deleting the data " + error);
  }
});
*/

module.exports = router;
