const mongoose = require("mongoose");
const { RESOURCE } = require("../constants/index");

const equipmentSchema = new mongoose.Schema({
  equipment_name: {
    type: String,
    required: [true, "Equipment name required"],
    maxLength: [60, "Equipment name must not exceed to 60 characters"],
  },
  equipment_status: {
    type: String,
    enum: ["Found", "Missing", "Lost"],
    default: "Found",
  },
  equipment_price: {
    type: Number,
    required: [true, "Equipment price required"],
    default: 0,
  },
  quantity: {
    type: Number,
    required: false,
    default: 0,
  },
  missing_qty: {
    type: Number,
    required: false,
    default: 0,
  },
  damage_qty: {
    type: Number,
    required: true,
    default: 0,
  },
  borrow_qty: {
    type: Number,
    required: false,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Available", "Not Available"],
    default: "Available",
  },
});

module.exports = mongoose.model(RESOURCE.EQUIPMENT, equipmentSchema);
