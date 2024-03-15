const mongoose = require("mongoose");
const { RESOURCE } = require("../constants/index");

const deliverySchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: [true, "Company name field required"],
        maxLength: [60, "Company name field must not exceed to 60 characters"],
    },
    brand: {
        type: String,
        required:[true, "Brand name field required"],
        maxLength: [60, "Brand field must not exceed to 60 characters"]
    },
    product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Please enter a product"],
            ref: RESOURCE.PRODUCT,
        }
    ],
    quantity:{
        type: Number,
        required: [true, "Quantity field required"],
        default: 0,
    }
});

module.exports = mongoose.model(RESOURCE.DELIVERY, deliverySchema)