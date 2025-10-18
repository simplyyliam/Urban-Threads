import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

export async function initSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  if (!searchInput || !searchResults) {
    console.error("Search elements not found!");
    return;
  }

  let products = [];

  // Load products
  const querySnapshot = await getDocs(collection(db, "products"));
  products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log("Loaded products:", products);

  // Attach search event
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    console.log("Search input:", query);

    if (!query) {
      searchResults.classList.remove("open");
      searchResults.innerHTML = "";
      return;
    }

    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(query)
    );
    console.log("Filtered results:", filtered);

    if (filtered.length > 0) {
      searchResults.innerHTML = filtered.map(item => `
        <div class="search-result-item" data-id="${item.id}">
          ${item.name} - R${item.price}
        </div>
      `).join("");
      searchResults.classList.add("open");
    } else {
      searchResults.innerHTML = `<div class="no-results">No results found</div>`;
      searchResults.classList.add("open");
    }
  });

  // Click result → go to checkout
  searchResults.addEventListener("click", (e) => {
    if (e.target.classList.contains("search-result-item")) {
      const productId = e.target.getAttribute("data-id");
      window.location.href = `/src/pages/checkout.html?id=${productId}`;
    }
  });
}
