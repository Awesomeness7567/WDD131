// Constants and variables example

const PI = 3.14;
let radius = 3;

let area = radius * radius * PI;

console.log("The area of the circle is: " + area);

radius = 20;

area = radius * radius * PI;
console.log("The area of the circle is: " + area);

//type coercion example

const one = 1;
const two = '2';

let result = one * two;
console.log("The result of multiplying one and two is: " + result);

result = one + Number(two);
console.log("The result of adding one and two is: " + result);

//Scope example

let course = "CSE131"; //global scope
if (true) {
    let student = "John";
    console.log(course);  //works just fine, course is global
    console.log(student); //works just fine, it's being accessed within the block
}
console.log(course); //works fine, course is global
console.log(student); //does not work, can't access a block variable outside the block