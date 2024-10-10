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

module.exports = validateSignup;
