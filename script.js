// console.log('====================================');
// console.log("Connected");
// console.log('====================================');


const products = [
    { id: 1, name: "Tie-Dye Lounge Set", price: 150.00, image: "assets/Photos/1.jpg" },
    { id: 2, name: "Sunburst Tracksuit", price: 150.00, image: "assets/Photos/2.jpg" },
    { id: 3, name: "Retro Red Streetwear", price: 150.00, image: "assets/Photos/3.jpg" },
    { id: 4, name: "Urban Sportwear Combo", price: 150.00, image: "assets/Photos/4.jpg" },
    { id: 5, name: "Chic Shirt", price: 150.00, image: "assets/Photos/5.jpg" },
    { id: 6, name: "Oversized Knit & Coat", price: 150.00, image: "assets/Photos/6.jpg" },
];


const selectedItems = new Map();

const productGrid = document.getElementById("product-grid");
const selectedContainer = document.getElementById("selected-items");
const selectedCount = document.getElementById("selected-count");
const progressFill = document.getElementById("progress-fill");
const subtotalEl = document.getElementById("subtotal");
const discountEl = document.getElementById("discount");
const totalEl = document.getElementById("total");
const discountRow = document.getElementById("discount-section");
const addToCartBtn = document.getElementById("add-to-cart");

function renderProducts() {
    productGrid.innerHTML = "";

    products.forEach(product => {
        const isSelected = selectedItems.has(product.id);

        const card = document.createElement("div");
        card.className = "product-card";

        const buttonText = isSelected ? " Added to the Bundle ✓" : "Add to Bundle";
        const buttonClass = isSelected ? "select-btn selected" : "select-btn";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <button class="${buttonClass}" data-id="${product.id}">
                <span>${buttonText}</span>
            </button>
        `;

        productGrid.appendChild(card);
    });

    attachSelectHandlers();
}

function attachSelectHandlers() {
    document.querySelectorAll(".select-btn").forEach(button => {
        button.addEventListener("click", () => {
            const productId = parseInt(button.getAttribute("data-id"));

            if (selectedItems.has(productId)) {
                selectedItems.delete(productId);
            } else {
                selectedItems.set(productId, 1);
            }

            updateSidebar();
            renderProducts(); 
        });
    });
}


function updateSidebar() {
    selectedContainer.innerHTML = "";

    if (selectedItems.size === 0) {
        selectedContainer.innerHTML = `<div class="empty-state"><p>No items selected yet</p></div>`;
        progressFill.style.width = "0%";
        selectedCount.innerText = "0";
        subtotalEl.innerText = "0";
        discountEl.innerText = "0";
        totalEl.innerText = "0";
        addToCartBtn.disabled = true;
        discountRow.style.display = "none";
        return;
    }

    let subtotal = 0;

    selectedItems.forEach((quantity, productId) => {
        const product = products.find(p => p.id === productId);
        subtotal += product.price * quantity;

        const itemEl = document.createElement("div");
        itemEl.className = "selected-item";

        itemEl.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div>
                <p>${product.name}</p>
                <p>₹${product.price}</p>
                <div class="quantity-controls">
                    <button class="decrease" data-id="${product.id}">-</button>
                    <span>${quantity}</span>
                    <button class="increase" data-id="${product.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${product.id}">🗑️</button>
        `;

        selectedContainer.appendChild(itemEl);
    });

    const discountEligible = selectedItems.size >= 3;
    const discountAmount = discountEligible ? Math.round(subtotal * 0.3) : 0;
    const total = subtotal - discountAmount;

    subtotalEl.innerText = subtotal;
    discountEl.innerText = discountAmount;
    totalEl.innerText = total;

    selectedCount.innerText = selectedItems.size;
    progressFill.style.width = `${(selectedItems.size / 3) * 100}%`;
    discountRow.style.display = discountEligible ? "flex" : "none";
    addToCartBtn.disabled = !discountEligible;

    attachQtyAndRemoveHandlers();
}

function attachQtyAndRemoveHandlers() {
    document.querySelectorAll(".increase").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            selectedItems.set(id, selectedItems.get(id) + 1);
            updateSidebar();
        });
    });

    document.querySelectorAll(".decrease").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            const currentQty = selectedItems.get(id);
            if (currentQty > 1) {
                selectedItems.set(id, currentQty - 1);
            }
            updateSidebar();
        });
    });

    document.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            selectedItems.delete(id);
            updateSidebar();
            renderProducts();
        });
    });
}

function showSuccessMessage() {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <img src="assets/Icons/Check.svg" alt=" " class="check-icon" />
            <span>Bundle added to cart successfully!</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

addToCartBtn.addEventListener("click", () => {
    showSuccessMessage();
});

renderProducts();
