const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const connectionReqModel = require("../models/connectionReq");

const router = express.Router();

router.get("/user/requests/recived", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const data = await connectionReqModel
      .find({
        toUserId: loggedInUserId,
        status: "interested",
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "about",
        "skills",
      ]);

    res.json({ message: "requests recived sucessfully ", data });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
