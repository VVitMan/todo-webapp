const numbers = [1, 2, 3, 4, 5];

// const result = numbers.map(num => {
//   if (num === 3) {
//     console.log("Found 3!");
//     return num * 10; // transform this one
//   }
//   return num; // others stay the same
// });

const filterResult = numbers.filter(f => f % 2 == 0)

const mapResult = numbers.map(f => {
    if (f % 2 == 0) {
        // console.log("Even Number");
        return f ** 2;
    }
    else    
        return f
})

console.log(filterResult);
console.log(mapResult);
// console.log(result);
