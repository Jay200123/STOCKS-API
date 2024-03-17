const mongoose = require("mongoose");
const { RESOURCE } = require("../constants/index");

const productSchema = new mongoose.Schema({
    product_name:{
        type: String,
        required: [true, "Product name field required"],
        maxLength: [60, "Product name must not exceed to 60 characters"],
    },
    price:{
        type: Number,
        required: [true, "Price field required"],
        default: 0,
    },
    quantity:{
        type: Number,
        required: [true, "Quantity field required"],
        default: 0,
    },
    product_session:{
        type: Number,
        required: [true, "Please Enter product number per session"],
        default: 0,
    },
    product_volume:{
        type: Number,
        required:[true, "Please enter product volume"],
        default: 0,
    }
});

module.exports = mongoose.model(RESOURCE.PRODUCT, productSchema);