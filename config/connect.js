const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.log(err);
  };
  console.log(`Mongo DB Cloud Connection Successfully Establish with host ${mongoose.connection.host}`)
};

module.exports = connectDB;
