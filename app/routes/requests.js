const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");

router.post("/sendconnectionReq", userAuth, async (req, res) => {
  try {
    res.send("Sending connection Requests");
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
