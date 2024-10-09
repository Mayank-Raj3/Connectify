const express = require("express");
const app = express();

app.get("/user/:id", (req, res) => {
  console.log(req.params);
  res.send({
    firstname: "Mayank",
    lastname: "Raj",
  });
});

app.get(
  "/user",
  (req, res, next) => {
    next();
  },
  (req, res, next) => {
    // res.send("Hellp");
    next();
  },
  (req, res) => {
    res.send("Hellp3");
  }
);

app.listen(3000, () => {
  console.log("Running the server");
});
