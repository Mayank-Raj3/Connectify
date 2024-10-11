const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionReqModel = require("../models/connectionReq");
const { validateSendConnections } = require("../utils/validation");

router.post("/req/send/:status/:toUserId", userAuth, async (req, res, next) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const isvalidReq = await validateSendConnections(
      fromUserId,
      toUserId,
      status
    );
    if (isvalidReq != 0) {
      throw new Error(isvalidReq);
    }

    const connectionReqObj = new connectionReqModel({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionReqObj.save();

    res.status(201).json({ message: "Connection request sent", data });
  } catch (error) {
    next(error);
  }
});

router.use((err, req, res, next) => {
  console.error(err.message);
  res.status(400).json({ message: err.message });
});

module.exports = router;
