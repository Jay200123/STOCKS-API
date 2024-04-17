const Transaction = require("../models/transaction");
const { RESOURCE } = require("../constants/index");

exports.getAllServiceTypesData = async () => {
  const serviceCounts = await Transaction.aggregate([
    {
      $lookup: {
        from: "services", // Assuming "services" is the name of your service collection
        localField: "service",
        foreignField: "_id",
        as: "serviceDetails",
      },
    },
    {
      $unwind: "$serviceDetails",
    },
    {
      $match: {
        "serviceDetails.type": { $in: ["Hair", "Facial", "Feet"] },
      },
    },
    {
      $group: {
        _id: "$serviceDetails.type",
        count: { $sum: 1 },
      },
    },
  ]).exec();

  return serviceCounts;
};
