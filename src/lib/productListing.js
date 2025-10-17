import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

async function fetchProducts() {
  const productsGrid = document.querySelector(".products__grid");
  productsGrid.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((doc) => {
      const product = doc.data();

      const productCard = `<div class="product__card">
            <div class="product__image">
              <img src="${product.imageURL}" alt="${product.name}">
            </div>
            <div class="product__info">
              <div class="product__header">
                <h3 class="product__name">${product.name}</h3>
                <div class="product__tag">
                  <div class="tag">
                    <span class="tag-text">${product.category}</span>
                  </div>
                  <div class="tag">
                    <div class="color-dot" style="background:${product.colorHex}"></div>
                    <span class="tag-text">${product.color}</span>
                  </div>
                </div>
              </div>
              <p class="product__price">R${product.price}</p>
            </div>
          </div>`;
      productsGrid.innerHTML += productCard;
    });
  } catch (error) {
    console.error("Error loading products:", error);
    productsGrid.innerHTML = "<p>Failed to load products.</p>";
  }
}
fetchProducts();
