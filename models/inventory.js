const mongoose = require("mongoose");
const { RESOURCE } = require("../constants/index");

const inventorySchema = new mongoose.Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Transaction field required"],
    ref: RESOURCE.TRANSACTION,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Service field required"],
    ref: RESOURCE.SERVICE,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Product field required"],
    ref: RESOURCE.PRODUCT,
  },
  product_consume: {
    type: Number,
    required: [true, "Consumed product volume required"],
  },
  old_volume: {
    type: Number,
    required: [true, "Old volume required"],
  },
  remained_volume: {
    type: Number,
    required: [true, "Remaining product volume required"],
  },
  old_quantity: {
    type: Number,
    required: [true, "product past quantity required"],
  },
  remained_quantity: {
    type: Number,
    required: [true, "Product Remaining Quantity Required"],
  },
  used_quantity: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model(RESOURCE.INVENTORY, inventorySchema);
