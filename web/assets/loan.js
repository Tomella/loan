//import HeadElement from "../components/lt-head.js";
import config from "./config.js";


const header = document.querySelector("loan-head");
const form   = document.querySelector("loan-form");

let response = await fetch(config.dataUrl);
let data = await response.json();


data.interest.forEach(interest => interest.start = new Date(interest.start));
data.journal.forEach(item => {
   item.date = new Date(item.date);
   if(item.type === 'W') {
      if(item.amount > 0) {
         item.amount *= -1;
      }
   } else if(item.type === 'D') {
      if(item.amount < 0) {
         item.amount *= -1;
      }
   }
});
data.start = new Date(data.start);

header.name = data.name;
header.start = data.start;
header.interest = form.interest = data.interest[0].rate;

form.addEventListener("change", (ev) => {
});

console.log(data);
