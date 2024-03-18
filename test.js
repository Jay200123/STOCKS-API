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