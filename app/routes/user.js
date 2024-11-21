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
    res.json({ message: "Something Went Wrong " + error });
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
// feed/?page=1&limit=2
router.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await connectionReqModel
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
