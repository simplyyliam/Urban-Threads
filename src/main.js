import { db } from "./lib/firebase";
import { collection, getDocs } from "firebase/firestore";
document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product");
  async function loadProducts() {
    const productsCol = collection(db, "products");
    const productSnapshot = await getDocs(productsCol);
    productSnapshot.forEach((doc) => {
      const product = doc.data()
      const li = document.createElement('li')
      li.textContent = product.name
      productList.appendChild(li)
    });
  }

  loadProducts();
});
