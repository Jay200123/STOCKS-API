const mongoose = require("mongoose");
const { RESOURCE } = require("../constants/index");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name required"],
        maxLength: [60, "Name must not exceed to 60 characters"],
    },
    mobile_number:{
        type: String,
        required: [true, "Mobile number required"],
        maxLength: [11, "Mobile number must not exceed to 11 numbers"]
    },
    address:{
        type: String,
        required: [true, "Address field required"],
    },
    description:{
        type: String,
        required: [true, "User description required"], 
    }
});

module.exports = mongoose.model(RESOURCE.USER, userSchema);