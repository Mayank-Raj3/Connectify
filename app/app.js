const express = require("express");
const app = express();
const connect_db = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = new User({
    // Create a new instance
    firstName: "Aman",
    lastName: "Raushan",
    emailId: "aman@example.com",
    password: "231",
    age: 22,
    gender: "Male",
  });

  try {
    await userObj.save();
    res.status(201).send(userObj);
  } catch (error) {
    res.status(400).send({ error: "Error saving user" + error });
  }
});

app.listen(3000, () => {
  console.log("Running the server");
  connect_db();
});
