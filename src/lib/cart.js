// cart.js

// DOM elements
const cartItemsContainer = document.getElementById("cartItems");
const subtotalEl = document.querySelector(".cart__summary-row span:nth-child(2)"); // first row 
const shippingEl = document.querySelector(".cart__summary-row:nth-child(2) span:nth-child(2)"); // second row
const totalEl = document.querySelector(".cart__summary-total span:nth-child(2)");

// A fixed shipping cost
const SHIPPING_COST = 99;


// initializing a variable "cart" by retrieving the value stored in the "cart" key of the session storage.
let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

// renderCart is responsible for rendering all the items in the cart with a dynamic cart__item element
function renderCart() {
  cartItemsContainer.innerHTML = "";

  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;

    const itemEl = document.createElement("div");
    itemEl.classList.add("cart__item");

    itemEl.innerHTML = `
      <div class="cart__item-image" style="background-image: url('${item.imageURL}')"></div>
      <div class="cart__item-info">
        <h3 class="cart__item-name">${item.name}</h3>
        <p class="cart__item-price">R${item.price}</p>
        <div class="cart__item-quantity">
          <button class="cart__qty-btn" data-action="decrease" data-index="${index}">-</button>
          <span class="cart__qty-value">${item.quantity}</span>
          <button class="cart__qty-btn" data-action="increase" data-index="${index}">+</button>
          <button class="cart__item-remove" data-index="${index}">Remove</button>
        </div>
      </div>
    `;

    cartItemsContainer.appendChild(itemEl);
  });

  updateSummary(subtotal);
}

// This updates the summary when new items are added or removed
function updateSummary(subtotal) {
  subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
  shippingEl.textContent = `R${SHIPPING_COST.toFixed(2)}`;
  totalEl.textContent = `R${(subtotal + SHIPPING_COST).toFixed(2)}`;
}

// The cartItemContainer handles the increment/decrement of the quantity amount, ad well as handling the remove from cart action.
cartItemsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".cart__qty-btn, .cart__item-remove");
  if (!btn) return;

  const index = parseInt(btn.dataset.index);

  if (btn.dataset.action === "increase") {
    cart[index].quantity += 1;
  } else if (btn.dataset.action === "decrease") {
    if (cart[index].quantity > 1) cart[index].quantity -= 1;
  } else if (btn.classList.contains("cart__item-remove")) {
    cart.splice(index, 1);
  }

  sessionStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
});

// initial render
renderCart();
