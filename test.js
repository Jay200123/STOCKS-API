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

let product_vol = 1000;

let long_vol = product_vol * 0.5 / 10;
console.log(long_vol);
let current_volume = 700;
// console.log(long_vol)
let newVolume = current_volume - long_vol;
console.log(newVolume);

const test2 = 100 * 0.5 / 10;
console.log("Test mo ulo mo", test2);