/* IC14 – COSC 2328-1 – Professor McCurry */
/* Implemented by: Richard Walker */

const ProductCatalogModule = (() => {
    /* Product Data Management */
    const productData = [
        { name: "Wireless Mouse", price: 29.99, category: "Electronics", stock: 45 },
        { name: "Mechanical Keyboard", price: 89.99, category: "Electronics", stock: 23 },
        { name: "USB-C Hub", price: 45.50, category: "Accessories", stock: 67 },
        { name: "Laptop Stand", price: 34.99, category: "Accessories", stock: 31 },
        { name: "Webcam HD", price: 79.99, category: "Electronics", stock: 18 },
        { name: "Desk Lamp", price: 24.99, category: "Office", stock: 52 },
        { name: "Monitor 27-inch", price: 299.99, category: "Electronics", stock: 12 },
        { name: "Ergonomic Chair", price: 199.99, category: "Furniture", stock: 8 }
    ];

    let catalog = [];

    /* Product Constructor & Prototype */
    function Product(name, price, category, stock) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.stock = stock;
        this.inStock = stock > 0;
    }

    Product.prototype.getInfo = function () {
        return `${this.name} - $${this.price.toFixed(2)} - ${this.category} - Stock: ${this.stock}`;
    };

    Product.prototype.applyDiscount = function (percentage) {
        this.price = Number((this.price - (this.price * percentage / 100)).toFixed(2));
    };

    Product.prototype.isExpensive = function () {
        return this.price > 50;
    };

    class ProductClass {
        constructor(name, price, category, stock) {
            this.name = name;
            this.price = price;
            this.category = category;
            this.stock = stock;
            this.inStock = stock > 0;
        }

        getInfo() {
            return `${this.name} - $${this.price.toFixed(2)} - ${this.category} - Stock: ${this.stock}`;
        }

        applyDiscount(percentage) {
            this.price = Number((this.price - (this.price * percentage / 100)).toFixed(2));
        }

        isExpensive() {
            return this.price > 50;
        }
    }

    class PremiumProduct extends ProductClass {
        constructor(name, price, category, stock, warrantyYears) {
            super(name, price, category, stock);
            this.warrantyYears = warrantyYears;
        }

        getInfo() {
            return `${this.name} - $${this.price.toFixed(2)} - ${this.category} - Stock: ${this.stock} - Warranty: ${this.warrantyYears} years`;
        }

        extendWarranty(years) {
            this.warrantyYears += years;
        }
    }

    function createCatalog() {
        catalog = productData.map(product => new Product(
            product.name,
            product.price,
            product.category,
            product.stock
        ));
    }

    function createProductCard(product) {
        const card = document.createElement("div");
        card.className = "product-card";

        const stockClass = product.inStock ? "in-stock" : "out-of-stock";
        const stockText = product.inStock ? `In Stock (${product.stock})` : "Out of Stock";
        const premiumBadge = product.warrantyYears
            ? `<div class="premium-badge">${product.warrantyYears} Year Warranty</div>`
            : "";

        card.innerHTML = `
            <h3>${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p>${product.category}</p>
            <p class="${stockClass}">${stockText}</p>
            ${premiumBadge}
        `;

        return card;
    }

    /* Display All Products Function */
    function displayAllProducts() {
        const productContainer = document.getElementById("product-container");
        productContainer.innerHTML = "";

        catalog.forEach(product => {
            productContainer.appendChild(createProductCard(product));
        });

        updateStats(catalog);
    }

    /* Filter Expensive Products Function */
    function filterExpensiveProducts() {
        const productContainer = document.getElementById("product-container");
        const expensiveProducts = catalog.filter(product => product.price > 50);

        productContainer.innerHTML = "";

        expensiveProducts.forEach(product => {
            productContainer.appendChild(createProductCard(product));
        });

        updateStats(expensiveProducts);
    }

    /* Calculate Total Value Function */
    function calculateTotalValue() {
        const totalValue = catalog.reduce((total, product) => total + product.price, 0);
        const totalProducts = catalog.length;
        const totalStock = catalog.reduce((total, product) => total + product.stock, 0);
        const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

        const statsContainer = document.getElementById("stats-container");
        statsContainer.innerHTML = `
            <div class="stat-box">
                <span class="stat-value">${totalProducts}</span>
                <span class="stat-label">Products Displayed</span>
            </div>
            <div class="stat-box">
                <span class="stat-value">${totalStock}</span>
                <span class="stat-label">Total Units</span>
            </div>
            <div class="stat-box">
                <span class="stat-value">$${avgPrice.toFixed(2)}</span>
                <span class="stat-label">Average Price</span>
            </div>
            <div class="stat-box">
                <span class="stat-value">$${totalValue.toFixed(2)}</span>
                <span class="stat-label">Total Catalog Value</span>
            </div>
        `;

        mapProductNamesAndPrices();
    }

    /* Add Premium Product Functionality */
    function addPremiumProduct() {
        const premiumProduct = new PremiumProduct(
            "Gaming Headset Pro",
            129.99,
            "Electronics",
            15,
            3
        );

        catalog.push(premiumProduct);
        displayAllProducts();
    }

    /* Price Transformation Function */
    function mapProductNamesAndPrices() {
        const mappedProducts = catalog.map(product => `${product.name} - $${product.price.toFixed(2)}`);
        console.log(mappedProducts);
    }

    /* Module Pattern Implementation */
    function updateStats(productList) {
        const totalProducts = productList.length;
        const totalStock = productList.reduce((total, product) => total + product.stock, 0);
        const avgPrice = totalProducts > 0
            ? productList.reduce((total, product) => total + product.price, 0) / totalProducts
            : 0;

        const statsContainer = document.getElementById('stats-container');
        statsContainer.innerHTML = `
            <div class="stat-box">
                <span class="stat-value">${totalProducts}</span>
                <span class="stat-label">Products Displayed</span>
            </div>
            <div class="stat-box">
                <span class="stat-value">${totalStock}</span>
                <span class="stat-label">Total Units</span>
            </div>
            <div class="stat-box">
                <span class="stat-value">$${avgPrice.toFixed(2)}</span>
                <span class="stat-label">Average Price</span>
            </div>
        `;
    }

    function bindEvents() {
        document.getElementById("btn-show-all").addEventListener("click", displayAllProducts);
        document.getElementById("btn-filter-expensive").addEventListener("click", filterExpensiveProducts);
        document.getElementById("btn-calculate-total").addEventListener("click", calculateTotalValue);
        document.getElementById("btn-add-premium").addEventListener("click", addPremiumProduct);
    }

    function init() {
        createCatalog();
        bindEvents();
    }

    return {
        init
    };
})();

document.addEventListener("DOMContentLoaded", ProductCatalogModule.init);