const validator = require("validator");

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
  console.log(data);
  const allowedUpdates = ["photoUrl", "about", "skills"];
  const isValidUpdate = Object.keys(data).every((key) =>
    allowedUpdates.includes(key)
  );

  if (!isValidUpdate) throw new Error("Update Not allowed");
  if (data.skills && data.skills.length > 10)
    throw new Error("Too many skills");

  return true;
};

module.exports = { validateSignup, validateEditProfile };
