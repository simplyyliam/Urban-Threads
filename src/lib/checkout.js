import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

// Try to load product from sessionStorage
const productData = JSON.parse(sessionStorage.getItem("selectedProduct"));

if (productData) {
  document.getElementById("product__name").textContent = productData.name;
  document.getElementById("product__price").textContent =
    "R" + productData.price;
  document.getElementById(
    "product__image"
  ).style.backgroundImage = `url(${productData.imageURL})`;
} else {

  async function loadCheckoutProduct() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) return;

    const productRef = doc(db, "products", productId);
    const productSnapshot = await getDoc(productRef);

    if (productSnapshot.exists()) {
      const product = productSnapshot.data();
      document.getElementById("product__name").textContent = product.name;
      document.getElementById("product__price").textContent =
        "R" + product.price;
      document.getElementById(
        "product__image"
      ).style.backgroundImage = `url(${product.imageURL})`;
    }
  }

  loadCheckoutProduct();
}

const addCartBtn = document.getElementById("add-cart");

const currentProduct = JSON.parse(sessionStorage.getItem("selectedProduct"));

addCartBtn.addEventListener("click", () => {
  if (!currentProduct) return;

  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  // Check if the item is already in cart (optional, by id)
  const existingIndex = cart.findIndex(item => item.id === currentProduct.id);
  if (existingIndex > -1) {

    cart[existingIndex].quantity += 1;
  } else {

    cart.push({ ...currentProduct, quantity: 1 });
  }

  sessionStorage.setItem("cart", JSON.stringify(cart));

  alert(`${currentProduct.name} added to cart!`);
});
