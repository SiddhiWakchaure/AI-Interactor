const mongoose = require("mongoose");
const config = require("config");

//Database connection to mongodb atlas
mongoose
  .connect(config.get("MongoURI"))
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
