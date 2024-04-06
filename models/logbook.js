const mongoose = require("mongoose");
const { RESOURCE } = require("../constants/index");

const LogbookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "user required"],
    ref: RESOURCE.USER,
  },
  equipment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "equipment required"],
      ref: RESOURCE.EQUIPMENT,
    },
  ],
  date_borrowed: {
    type: Date,
    required: [true, "date borrowed required"],
    default: Date.now(),
  },
  date_returned: {
    type: Date,
    required: false,
  },
  note: {
    type: String,
    required: false,
  }
});

module.exports = mongoose.model(RESOURCE.LOGBOOK, LogbookSchema);
