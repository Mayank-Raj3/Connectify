const mongoose = require("mongoose");
const validator = require("validator");
const { SALT } = require("../config/config");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 3,
      max: 40,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/048/334/475/small/a-person-icon-on-a-transparent-background-png.png",
      // validate(value) {
      //   console.log(value);
      //   if (value.length && !validator.isDataURI(value))
      //     throw Error("url is not valid");
      // },
    },
    // isDataURI

    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const payload = {
    userId: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  try {
    const token = await jwt.sign(payload, SALT, { expiresIn: "1h" });
    return token;
  } catch (error) {
    console.error("Error generating JWT:", error);
    throw new Error("Error generating JWT");
  }
};
userSchema.methods.validatePassword = async function (paswordInp) {
  const user = this;
  const passwordHash = user.password;
  try {
    const isCorrectPassword = await bcrypt.compare(paswordInp, passwordHash);
    return isCorrectPassword;
  } catch (error) {
    throw new Error("Invalid email or password ");
  }
};
module.exports = mongoose.model("User", userSchema);
