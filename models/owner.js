const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true, // fast login/query
    },
    password: {
      type: String,
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
      index: true, // allows filtering/searching by restaurant
    },
    address: {
      street: { type: String, required: true },
      city: { type: String ,required: true },
      state: { type: String,required: true },
      pincode: { type: String,required: true },
      country: { type: String, default: "India" },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Owner', ownerSchema);