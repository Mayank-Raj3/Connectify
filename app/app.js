const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const connect_db = require("./config/database");
const cookieParser = require("cookie-parser");
const corsOptions = {
  origin: "http://localhost:5173", // frontend URL
  credentials: true, // Allow credentials (cookies, headers)
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

app.listen(3000, () => {
  console.log("Running the server");
  connect_db();
});
