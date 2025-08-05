console.log('====================================');
console.log("Connected");
console.log('====================================');


const products = [
  { id: 1, name: "Product 1", price: 500, image: "assets/product-1.jpg" },
  { id: 2, name: "Product 2", price: 600, image: "assets/product-2.jpg" },
  { id: 3, name: "Product 3", price: 700, image: "assets/product-3.jpg" },
  { id: 4, name: "Product 4", price: 800, image: "assets/product-4.jpg" },
  { id: 5, name: "Product 5", price: 900, image: "assets/product-5.jpg" },
  { id: 6, name: "Product 6", price: 1000, image: "assets/product-6.jpg" }
];


const selected = [];

const productGrid = document.getElementById("product-grid");
const selectedItems = document.getElementById("selected-items");
const selectedCount = document.getElementById("selected-count");
const progressFill = document.getElementById("progress-fill");
const subtotalEl = document.getElementById("subtotal");
const discountEl = document.getElementById("discount");
const discountSection = document.getElementById("discount-section");
const totalEl = document.getElementById("total");
const addToCartBtn = document.getElementById("add-to-cart");


products.forEach((product) => {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" />
    <h3>${product.name}</h3>
    <p>₹${product.price}</p>
    <button data-id="${product.id}">Add to Bundle</button>
  `;
  productGrid.appendChild(card);
});

productGrid.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    const id = parseInt(e.target.dataset.id);
    const product = products.find((p) => p.id === id);
    const index = selected.findIndex((item) => item.id === id);

    if (index === -1) {
      selected.push(product);
      e.target.textContent = "Remove from Bundle";
      e.target.classList.add("selected");
    } else {
      selected.splice(index, 1);
      e.target.textContent = "Add to Bundle";
      e.target.classList.remove("selected");
    }

    updateSidebar();
  }
});

function updateSidebar() {
  selectedCount.textContent = selected.length;
  progressFill.style.width = `${(selected.length / 3) * 100}%`;
  selectedItems.innerHTML = "";
  selected.forEach((item) => {
    const div = document.createElement("div");
    div.className = "sidebar-item";
    div.innerHTML = `
      <img src="${item.image}" />
      <p>${item.name}</p>
      <p>₹${item.price}</p>
    `;
    selectedItems.appendChild(div);
  });

  const subtotal = selected.reduce((sum, item) => sum + item.price, 0);
  let discount = 0;

  if (selected.length >= 3) {
    discount = Math.floor(subtotal * 0.3);
    discountSection.style.display = "block";
  } else {
    discountSection.style.display = "none";
  }

  const total = subtotal - discount;

  subtotalEl.textContent = subtotal;
  discountEl.textContent = discount;
  totalEl.textContent = total;

  addToCartBtn.disabled = selected.length < 3;
}

addToCartBtn.addEventListener("click", () => {
  console.log("Final Bundle:", selected);
  alert("Bundle added! Check the console for details.");
});