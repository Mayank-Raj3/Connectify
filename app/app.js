const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const connect_db = require("./config/database");
const User = require("./models/user");
const validateSignup = require("./utils/validation");
const bcrypt = require("bcryptjs");

app.use(bodyParser.json());

// signup
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const data = await User.findOne({ emailId: emailId });
    if (!data) {
      throw new Error("Invalid email");
    }
    const isCorrectPassword = await bcrypt.compare(password, data.password);
    if (isCorrectPassword) res.status(200).send("User is logged In");
    else {
      throw new Error("Invalid email or password ");
    }
  } catch (error) {
    res.status(400).send("" + error);
  }
});
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

app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  const userId = req.params.userId;
  try {
    const allowedUpdates = ["password", "photoUrl", "about", "skills"];
    const isValidUpdate = (data) => {
      return data.every((it) => allowedUpdates.includes(it));
    };
    if (!isValidUpdate) throw new Error("Update Not allowed");
    if (data?.skills.length > 10) throw new Error("Too many skills ");

    await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.status(201).send("User Successfully Updated");
  } catch (error) {
    res.status(500).send("Error Updating the data " + error);
  }
});

app.listen(3000, () => {
  console.log("Running the server");
  connect_db();
});
