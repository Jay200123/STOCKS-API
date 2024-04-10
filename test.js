let currentML = 0;

let value = 300;
let user_description = "Long Hair";

if(value < 1000){
    console.log(`value is ${value} ml`);
}else{
    let litter = value / 1000;
    console.log(`value is ${litter} litter`);
}

const currentValue = 1500;

const newValue = currentValue >= 1000 ? `${currentValue / 1000} Liter` : `${currentValue} ml`;
console.log(newValue);

testValue = "Hair"
desc1 = "Short Hair"
// desc2 = "Short Hair";

// eto ung service type 
// if (testValue === "Hair") {
//     try{
//         //dito ko kukunin user description
//         if(desc1 === "Long Hair"){
//             let product_vol = 200;
//             console.log(product_vol);
//         } else if (desc1 === "Short Hair"){
//             product_vol = 100;
//             console.log(product_vol);
//         }
//     }catch(err){
//         console.log(err)
//     }
// }else{
//     console.log(test)
// }

// const productVolume = 1000;

// const sessionVolume = 200 / 1000 * 1000;

// let deduction = sessionVolume - 150;
// console.log(deduction);

// console.log(sessionVolume);

// const tst = 100 * 0.5 / 10 * 10;
// console.log(tst);

// let product_vol = 1000;

// let long_vol = product_vol * 0.5 / 10;
// console.log(long_vol);
// let current_volume = 700;
// // console.log(long_vol)
// let newVolume = current_volume - long_vol;
// console.log(newVolume);

// const test2 = 100 * 0.5 / 10;
// console.log("Test mo ulo mo", test2);

// console.log(1000 * 0.2);

// let result = value1 - value2;

let value1 = 200;
let value2 = 200;

let result = value1 - value2;

if (result > 0) {
  console.log("test");
} else {
  console.log("test 2");
}

if(value1 > value2){
    console.log("pak u")
}

let newVolume = 300;
let oldVolume = 300;


// console.log(200 - 200);

// if(newVolume && oldVolume){
//     console.log("testing values!")
// }
// if ung babawas na volume is greater than remaining gagawin is 
const test = "completed";

const status = test == "cancelled";

if(status){
  console.log("test!")
}else{
  console.log("test 2")
}

const productVolume = 1000;

const dateToday = new Date(Date.now());
const formattedDate = dateToday.toLocaleDateString(); // Format the date
console.log(formattedDate);

const currentDate = new Date();
console.log(currentDate) // Create a new Date object representing the current date and time
