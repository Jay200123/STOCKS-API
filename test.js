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
if (testValue === "Hair") {
    try{
        //dito ko kukunin user description
        if(desc1 === "Long Hair"){
            let product_vol = 200;
            console.log(product_vol);
        } else if (desc1 === "Short Hair"){
            product_vol = 100;
            console.log(product_vol);
        }
    }catch(err){
        console.log(err)
    }
}else{
    console.log(test)
}

// const productVolume = 1000;

// const sessionVolume = 200 / 1000 * 1000;

// let deduction = sessionVolume - 150;
// console.log(deduction);

// console.log(sessionVolume);

const tst  = 100 * 0.2 * 10;
console.log(tst);