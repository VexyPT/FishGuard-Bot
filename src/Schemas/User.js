const { Schema, model } = require("mongoose");

const userSet = new Schema({
  _id: { type: String },
  coins: { type: Number, default: 0 },
  cooldowns: {
    daily: { type: String , default: 0 },
  }
});

module.exports = model("Users", userSet);