const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");
  console.log("Connected to MongoDB via Mongoose!");
}

main().catch((err) => console.log(err));
