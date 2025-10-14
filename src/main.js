import { db } from "./lib/firebase";
import { collection, getDocs } from "firebase/firestore";
document.addEventListener("DOMContentLoaded", () => {
  const product = document.getElementById("product");
  product.innerHTML = "asd";
  async function loadProducts() {
    const productsCol = collection(db, "products");
    const productSnapshot = await getDocs(productsCol);
    productSnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  }

  loadProducts();
});
