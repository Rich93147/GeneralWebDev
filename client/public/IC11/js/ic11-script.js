/* IC11 – COSC 2328 – Richard Walker */

/* =========================
   Function Declarations
========================= */
function greet(name) {
  return `Hello, ${name}!`;
}

function calculateArea(width, height) {
  return width * height;
}

console.log(greet("Kai"));
console.log("Area:", calculateArea(6, 4));

/* Function expressions*/
const multiply = function (a, b) {
  return a * b;
};

/* Arrow Functions */
const divide = (a, b) => {
  return a / b;
};

const square = (x) => x * x;

console.log("Multiply:", multiply(3, 5));
console.log("Divide:", divide(20, 4));
console.log("Square:", square(7));

/* Default Functions */
function greetWithDefault(name, greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log(greetWithDefault("Kai"));
console.log(greetWithDefault("Kai", "Welcome"));
console.log("Sum (3 nums):", sumAll(1, 2, 3));
console.log("Sum (5 nums):", sumAll(5, 10, 15, 20, 25));

/* Object Methods*/
const product = {
  brand: "something",
  price: 67.67,
  quantity: 1,
  totalCost() {
    return this.price * this.quantity;
  },
  info() {
    return `Product: ${this.brand} | Price: $${this.price} | Qty: ${this.quantity}`;
  },
};

console.log(product.info());
console.log("Total cost:", product.totalCost());