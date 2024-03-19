const mongoose = require("mongoose");
const { RESOURCE } = require("../constants/index");

const serviceSchema = new mongoose.Schema({
    service_name: {
        type: String,
        required: [true, "Service name field required"],
        maxLength: [60, "Service name must not exceed to 60 characters"]
    },
    service_price: {
        type: Number,
        required: [true, "Service price field required"],
        default: 0,
    },
    product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required:[true, "Product field required"],
            ref: RESOURCE.PRODUCT, 
        }
    ],
    type: {
        type: String,
        enum:["Hair","Eyelash","Hands"]
    }
});

module.exports = mongoose.model(RESOURCE.SERVICE, serviceSchema)