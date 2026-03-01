// IC13 – COSC 2328-1 – Professor McCurry
// Implemented by: Richard Walker

// ===== Order State Management =====
let selectedProduct = null;
let currentQuantity = 1;

// ===== Display Update Functions =====
function updateOrderSummary() {
    const summaryProduct = document.querySelector("#summary-product");
    const summaryTotal = document.querySelector("#summary-total");

    if (selectedProduct) {
        summaryProduct.textContent = `Product: ${selectedProduct.name}`;
        const totalPrice = selectedProduct.price * currentQuantity;
        summaryProduct.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }
    else {
        summaryProduct.textContent = 'No product selected';
        summaryTotal.textContent = "Total: $0.00";
    }
};


// ===== Mouse Events - Product Selection =====

const productGallery = document.querySelector("#product-gallery");
const productNameInput = document.querySelector("#product-name");

productGallery.addEventListener("click", (e) => {
        let card = e.target.closest(".product-card");

        if (card) {
            selectedProduct = {
                name: card.dataset.productName,
                price: parseFloat(card.dataset.price)
            };
            productNameInput.value = selectedProduct.name;
            updateOrderSummary();
        }
    });


// ===== Form Events - Submit Validation =====

const orderForm = document.querySelector("#order-form");
orderForm.addEventListener("submit", function(e) {
    e.preventDefault();

    if (!selectedProduct) {
        alert("Please select a product before placing your order.");
        return;
    }

    const orderDetails = `
    Order Placed Successfully!
    Product: ${selectedProduct.name}
    Quantity: ${currentQuantity}
    Total: $${selectedProduct.price * currentQuantity}
    `;

    alert(orderDetails);
});