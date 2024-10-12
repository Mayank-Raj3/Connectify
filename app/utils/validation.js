const validator = require("validator");
const user = require("../models/user");
const connectionReqModel = require("../models/connectionReq");

const validateSignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (
    !firstName ||
    !lastName ||
    firstName.length < 4 ||
    firstName.length > 50
  ) {
    throw new Error("firstName or lastName not valid");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Not correct email");
  }
};

const validateEditProfile = (data) => {
  const allowedUpdates = ["photoUrl", "about", "skills"];
  const isValidUpdate = Object.keys(data).every((key) =>
    allowedUpdates.includes(key)
  );

  if (!isValidUpdate) throw new Error("Update Not allowed");
  if (data.skills && data.skills.length > 10)
    throw new Error("Too many skills");

  return true;
};

const validateSendConnections = async (fromUserId, toUserId, status) => {
  try {
    const allowedStatus = ["ignore", "interested"];
    if (!allowedStatus.includes(status)) {
      throw new Error(`Invalid status type: ${status}`);
    }

    if (fromUserId.toString() === toUserId) {
      throw new Error("Not allowed to send a request to yourself");
    }

    const isValidtoUserId = await user.findOne({ _id: toUserId });
    if (!isValidtoUserId) {
      throw new Error("User not present");
    }

    const existingConnectionReq = await connectionReqModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionReq) {
      throw new Error("Connection request already exists");
    }
  } catch (error) {
    return error;
  }

  return 0;
};

const validateReviewConnections = async (reqId, logedInuserId, status) => {
  try {
    // correct status code
  } catch (error) {
    return error;
  }

  return 0;
};

module.exports = {
  validateSignup,
  validateEditProfile,
  validateSendConnections,
  validateReviewConnections,
};
