const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const connect_db = require("./config/database");
const cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);

app.listen(3000, () => {
  console.log("Running the server");
  connect_db();
});
