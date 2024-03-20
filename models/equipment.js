const mongoose = require("mongoose");
const { RESOURCE } = require("../constants/index");

const equipmentSchema = new mongoose.model({
  equipment_name: {
    type: String,
    required: [true, "Equipment name required"],
    maxLength: [60, "Equipment name must not exceed to 60 characters"],
  },
  equipment_status: {
    type: String,
    enum: ["Found", "Missing", "Lost"],
    default:"Found",
  },
  equipment_price: {
    type: Number,
    required:[true, "Equipment price required"],
    default: 0,
  },
  isLost: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model(equipmentSchema, RESOURCE.EQUIPMENT);
