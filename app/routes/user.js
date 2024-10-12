const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const connectionReqModel = require("../models/connectionReq");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

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
router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connectionRequests = await connectionReqModel
      .find({
        $or: [
          { toUserId: loggedInUserId, status: "accepted" },
          { fromUserId: loggedInUserId, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    //  mayank's connection -> show aman
    // then aman's connection -> should show mayank
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUserId.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ message: "Requests received successfully", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
