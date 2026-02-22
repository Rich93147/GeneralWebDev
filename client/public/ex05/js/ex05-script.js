/* HW5 – COSC 2328 – Professor McCurry */
/* Implemented by: Richard Walker */

console.log("=== BOOKSTORE INVENTORY CALCULATOR ===");
const book1 = {
    title: "Book1",
    author: "Richard",
    price: 600000.00
};
const book2 = {
    title: "Book2",
    author: "Richard",
    price: 600000.00
};
const book3 = {
    title: "Book3",
    author: "Richard",
    price: 600000.00
};
const taxRate = .0825;
let customerMembershipStatus = false;
console.log(
  "--- Book Inventory ---\n" +
  "Title: " + book1.title + ", Author: " + book1.author + ", Price: $" + book1.price + "\n" +
  "Title: " + book2.title + ", Author: " + book2.author + ", Price: $" + book2.price + "\n" +
  "Title: " + book3.title + ", Author: " + book3.author + ", Price: $" + book3.price
);

function calculateSubtotal(price, quantity) {
    return price * quantity;
};

function formatCurrency(float) {
    return float.toFixed(2);
};

const calculateTax = (subtotal) => subtotal * taxRate;

const applyMemberDiscount = (subtotal, isMember) => {
    return isMember ? subtotal * .9 : subtotal;
};

console.log("--- Arrow Functions Test---");

const calculateTotal = function (price, quantity = 1, isMember = false) {
  const subtotal = calculateSubtotal(price, quantity);
  const discountedSubtotal = applyMemberDiscount(subtotal, isMember);
  const tax = calculateTax(discountedSubtotal);
  return discountedSubtotal + tax;
};

console.log("--- Function Expression with Defaults ---");
console.log("All arguments:", calculateTotal(book1.price, 2, true));
console.log("Price + quantity only:", calculateTotal(book1.price, 2));
console.log("Price only:", calculateTotal(book1.price));

function calculateBulkOrder(...prices) {
  let total = 0;
  for (let i = 0; i < prices.length; i++) {
    total += prices[i];
  }
  return total;
};

console.log("--- Rest Operator Test ---");
console.log("Three prices:", calculateBulkOrder(book1.price, book2.price, book3.price));
console.log(
  "Five prices:", calculateBulkOrder(book1.price, book2.price, book3.price, 19.99, 7.5)
);

function processOrder(book, quantity, callback) {
  const orderTotal = callback(book.price, quantity);
  return "Order: " + book.title + " || Total: $" + orderTotal;
}

function standardPricing(price, quantity) {
  return price * quantity;
}

function memberPricing(price, quantity) {
  return price * quantity * 0.9;
}

console.log("--- Callback Functions ---");
console.log(processOrder(book1, 2, standardPricing));
console.log(processOrder(book2, 2, memberPricing));

const orderSummary = {
  customerName: "Kai Cairo",
  items: [],
  addItem: function (book, quantity) {
    this.items.push({ book: book, quantity: quantity });
  },
  getTotal: function () {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      total += this.items[i].book.price * this.items[i].quantity;
    }
    return total;
  },
  displaySummary: function () {
    let summary = "Customer: " + this.customerName + "\nItems:\n";
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      summary += "- " + item.book.title + " (x" + item.quantity + "): $" + item.book.price * item.quantity + "\n";
    }
    summary += "Total: $" + this.getTotal();
    return summary;
  }
};

console.log("--- Object Methods ---");
orderSummary.addItem(book1, 1);
orderSummary.addItem(book3, 2);
console.log("Total:", orderSummary.getTotal());
console.log(orderSummary.displaySummary());

function validateDiscount(code) {
  if (code) {
    const DiscountCode = code.toUpperCase();
    if (DiscountCode === "MEMBER10") return 0.10;
    if (DiscountCode === "SAVE20") return 0.20;
  }
  return 0;
}

console.log("--- Truthy/Falsy Validation ---");
console.log("MEMBER10:", validateDiscount("MEMBER10"));
console.log("SAVE20:", validateDiscount("SAVE20"));
console.log('"":', validateDiscount(""));
console.log("INVALID:", validateDiscount("INVALID"));

function createOrderProcessor(storeName) {
  const storeTaxRate = 0.0825;

  function processStoreOrder(book, quantity) {
    const subtotal = book.price * quantity;
    const total = subtotal + subtotal * storeTaxRate;
    return (
      "Store: " + storeName + " | Book: " + book.title + " | Qty: " + quantity + " | Total w/ tax: $" + total
    );
  }

  return processStoreOrder;
}

console.log("--- Nested Functions & Closures ---");
const downtownProcessor = createOrderProcessor("Downtown Books");
console.log(downtownProcessor(book2, 3));