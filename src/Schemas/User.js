const { Schema, model } = require("mongoose");

const userSet = new Schema({
  _id: { type: String },
  money: { type: Number, default: 0 },
  cooldowns: {
    daily: { type: String , default: 0 }
  },
  work: {
    workedWith: { type: String },
    maxMoney: { type: Number },
    cooldown: { type: Number }
  }
});

module.exports = model("Users", userSet);