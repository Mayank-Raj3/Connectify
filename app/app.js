const express = require("express");
const app = express();

app.use("/hello", (req, res) => {
  console.log(req);
  res.send("Hello");
});
app.listen(3000, () => {
  console.log("Running the server");
});
