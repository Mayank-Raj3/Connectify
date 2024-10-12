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

    const validationError = await validateSendConnections(
      fromUserId,
      toUserId,
      status
    );
    if (validationError) {
      throw new Error(validationError);
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

router.post("/req/review/:status/:reqId", userAuth, async (req, res, next) => {
  try {
    const reqId = req.params.reqId;
    const status = req.params.status;
    const loggedInUserId = req.user._id;
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      throw new Error(`Invalid status type: ${status}`);
    }
    const connectionReqObj = await connectionReqModel.findOne({
      _id: reqId,
      toUserId: loggedInUserId._id,
      status: "interested",
    });

    if (!connectionReqObj) {
      throw new Error("Invalid connection request");
    }

    connectionReqObj.status = status;
    const data = await connectionReqObj.save();

    res.status(201).json({ message: "Connection request updated", data });
  } catch (error) {
    next(error);
  }
});

router.use((err, req, res, next) => {
  console.error(err.message);
  res.status(400).json({ message: err.message });
});

module.exports = router;
