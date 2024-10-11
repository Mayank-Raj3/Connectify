const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfile } = require("../utils/validation");
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
