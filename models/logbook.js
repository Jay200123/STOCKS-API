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
      equipment: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "equipment required"],
        ref: RESOURCE.EQUIPMENT,
      },
      borrow_quantity: {
        type: Number,
        required: true,
        default: 0,
      },
      missing_quantity: {
        type: Number,
        required: false,
        default: 0,
      },
      damage_quantity: {
        type: Number,
        required: false,
        default: 0,
      },
      status: {
        type: String,
        enum: ["Found","Missing","Damage", "Damage & Missing"],
        default: "Found",
      }
    },
  ],
  date_borrowed: {
    type: Date,
    required: [true, "date borrowed required"],
    default: Date.now(),
  },
  time_borrowed: {
    type: String,
    default: function() {
      const currentTime = new Date();
      return currentTime.toLocaleTimeString([], { hour12: true });
    },
  },
  date_returned: {
    type: Date,
    required: false,
  },
  note: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["Borrowed", "Returned"],
    default: "Borrowed",
  },
});


module.exports = mongoose.model(RESOURCE.LOGBOOK, LogbookSchema);