import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

async function fetchProducts() {
  const productsGrid = document.querySelector(".products__grid");
  productsGrid.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const productId = doc.id;

      const productCard = document.createElement("div");
      productCard.classList.add("product__card");

      productCard.innerHTML = `
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
              ${product.color ? `<div class="tag">
                <div class="color-dot" style="background:${product.colorHex}"></div>
                <span class="tag-text">${product.color}</span>
              </div>` : ""}
            </div>
          </div>
          <p class="product__price">R${product.price}</p>
        </div>
      `;

      // Add click listener to send data to checkout page
      productCard.addEventListener("click", () => {
        const productData = {
          id: productId,
          name: product.name,
          price: product.price,
          imageURL: product.imageURL,
          category: product.category,
          color: product.color || null,
          colorHex: product.colorHex || null,
        };
        // Store in sessionStorage
        sessionStorage.setItem("selectedProduct", JSON.stringify(productData));
        // Redirect to checkout
       window.location.href = `/src/pages/checkout.html?id=${productId}`;
      });

      productsGrid.appendChild(productCard);
    });
  } catch (error) {
    console.error("Error loading products:", error);
    productsGrid.innerHTML = "<p>Failed to load products.</p>";
  }
}

fetchProducts();
