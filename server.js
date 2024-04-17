const express = require("express");
const app = express();

require("dotenv").config({
  path: "./config/.env",
});

const Delivery = require("./models/delivery");
const Inventory = require("./models/inventory");
const Product = require("./models/product");
const Service = require("./models/service");
const Transaction = require("./models/transaction");
const LogBook = require("./models/logbook");
const Equipment = require("./models/equipment");
const Report = require("./models/report");

const { STATUSCODE } = require("./constants/index");
const products = require("./routes/product");
const delivery = require("./routes/delivery");
const services = require("./routes/service");
const transaction = require("./routes/transaction");
const inventory = require("./routes/inventory");
const user = require("./routes/user");
const equipment = require("./routes/equipment");
const logbook = require("./routes/logbook");
const report = require("./routes/report");
const chart = require("./routes/chart");

const connectDB = require("./config/connect");
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api/v1",
  products,
  delivery,
  services,
  transaction,
  inventory,
  user,
  equipment,
  logbook,
  report,
  chart,
);

app.get("/", (req, res) => {
  data = { message: "Testing backend data!" };
  res.status(STATUSCODE.SUCCESS).json(data);
});

app.get("/truncate", async (req, res) => {
  try {
    // await Delivery.deleteMany({});
    // await Product.deleteMany({});
    // await Service.deleteMany({});
    // await Inventory.deleteMany({});
    // await Transaction.deleteMany({});
    await LogBook.deleteMany({});
    await Equipment.deleteMany({});
    await Report.deleteMany({});
    const message = "All collections truncated successfully";
    res.status(STATUSCODE.SUCCESS).json({ message });
  } catch (error) {
    console.error("Error truncating collections:", error);
    const message = "Error truncating collections";
    res.status(STATUSCODE.SERVER_ERROR).json({ message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server Running on PORT ${process.env.PORT} on ${process.env.NODE_ENV}`
  );
});
