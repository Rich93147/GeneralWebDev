// HW6 – COSC 2328 – Professor McCurry
// Implemented by: Richard Walker

const productPrices = {
  laptop: 999.99,
  tablet: 499.99,
  phone: 699.99,
  monitor: 299.99
};

const discountCodes = {
  SAVE10: 0.10,
  SAVE20: 0.20,
  STUDENT: 0.15
};

const calculateTax = (subtotal) => subtotal * 0.0825;

const applyDiscount = function(subtotal, code) {
  const discount = discountCodes[code.toUpperCase()];
  return discount ? subtotal * discount : 0;
};

const form = document.getElementById('orderForm');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const product = document.getElementById('product').value;
  const quantity = parseInt(document.getElementById('quantity').value, 10);
  const discountCode = document.getElementById('discount').value;

  const price = productPrices[product];
  const subtotal = price * quantity;
  const discountAmount = applyDiscount(subtotal, discountCode);
  const tax = calculateTax(subtotal - discountAmount);
  const total = subtotal - discountAmount + tax;

  displayResults({ product, subtotal, discountAmount, tax, total });
});

const displayResults = ({ product, subtotal, discountAmount, tax, total }) => {
  document.getElementById("results").classList.remove("results-hidden");
  document.getElementById("resultProduct").textContent = product;
  document.getElementById("resultSubtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("resultDiscount").textContent = `$${discountAmount.toFixed(2)}`;
  document.getElementById("resultTax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("resultTotal").textContent = `$${total.toFixed(2)}`;
};
