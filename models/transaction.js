const mongoose = require("mongoose");
const { RESOURCE } = require("../constants/index");

const transactionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User field required"],
        ref: RESOURCE.USER,
    },
    service: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Service required"],
            ref: RESOURCE.SERVICE,
        }
    ],
    date: {
        type: Date,
        required: [true, "Please enter a date"],
        default: Date.now(),
    }
});

module.exports = mongoose.model(RESOURCE.TRANSACTION, transactionSchema)