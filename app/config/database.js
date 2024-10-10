const mongoose = require("mongoose");
const { MONGO_USERNAME, MONGO_PASSWORD } = require("./config");

const connect_db = async () => {
  mongoose.connect(
    `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.j05ui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  );
};

connect_db()
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = connect_db;
