const mongoose = require("mongoose");

const connectionReqSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      reqired: true,
      ref: "User", //reference to the usr collection
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      reqired: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);
connectionReqSchema.index({ fromUserId: 1, toUserId: 1 });
const connectionReqModel = new mongoose.model(
  "ConnectionRequest",
  connectionReqSchema
);
module.exports = connectionReqModel;
