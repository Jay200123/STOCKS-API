const express = require('express');
const app = express();

require("dotenv").config({
    path:"./config/.env"
});

const { STATUSCODE } = require("./constants/index");
const products = require("./routes/product");
const delivery = require("./routes/delivery");
const services = require("./routes/service");
const transaction = require("./routes/transaction");

const connectDB = require("./config/connect");
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended:true }))


app.use("/api/v1",
 products,
 delivery,
 services,
 transaction,
  );

app.get("/", (req, res)=>{
    data = { message:"Testing backend data!" }
    res.status(STATUSCODE.SUCCESS).json(data);
})


app.listen(process.env.PORT, ()=>{
    console.log(`Server Running on PORT ${process.env.PORT} on ${process.env.NODE_ENV}`);
})