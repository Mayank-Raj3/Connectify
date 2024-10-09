const mongoose = require("mongoose");

const connect_db = async () => {
  mongoose.connect(
    "mongodb+srv://Mynk28:EFQrGfIk9VoaVazN@cluster0.j05ui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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
