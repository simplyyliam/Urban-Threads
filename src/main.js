import { app } from "./lib/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initSearch } from "./lib/search"

const auth = getAuth(app);

/* ------------------ LOAD LAYOUT ------------------ */
async function loadLayout() {
  try {
    // Load navbar
    const navbar = await fetch("/src/components/navbar.html").then((res) =>
      res.text()
    );
    document.body.insertAdjacentHTML("afterbegin", navbar);

    // Load footer
    const footer = await fetch("/src/components/footer.html").then((res) =>
      res.text()
    );
    document.body.insertAdjacentHTML("beforeend", footer);
  } catch (error) {
    console.error("Error loading layout", error);
  }
}

/* ------------------ NAVBAR AUTH ------------------ */
async function initNavbarAuth() {

  await loadLayout();
  initSearch()

  // Get references to navbar elements
  const accountContainer = document.querySelector(".account");
  const accountProfile = document.getElementById("account__profile");
  const accountId = document.getElementById("account__id");
  const loginButton = document.getElementById("account__login");

  if (!accountContainer || !accountProfile || !accountId || !loginButton) {
    console.error("Navbar elements not found!");
    return;
  }

  // Create dynamic dropdown for sign out
  const signOutDropdown = document.createElement("div");
  signOutDropdown.classList.add("account__dropdown");
  signOutDropdown.style.position = "absolute";
  signOutDropdown.style.top = "50px";
  signOutDropdown.style.right = "0";
  signOutDropdown.style.background = "#fff";
  signOutDropdown.style.border = "1px solid #ccc";
  signOutDropdown.style.padding = "10px";
  signOutDropdown.style.borderRadius = "10px";
  signOutDropdown.style.display = "none"; // hidden initially
  signOutDropdown.style.cursor = "pointer";
  signOutDropdown.textContent = "Sign Out";
  accountContainer.appendChild(signOutDropdown);

  // Toggle dropdown on profile click
  accountProfile.addEventListener("click", (e) => {
    e.stopPropagation();
    signOutDropdown.style.display =
      signOutDropdown.style.display === "none" ? "block" : "none";
  });

  // Hide dropdown if clicked outside
  document.addEventListener("click", () => {
    signOutDropdown.style.display = "none";
  });

  // Sign out logic
  signOutDropdown.addEventListener("click", async () => {
    try {
      await signOut(auth);
      signOutDropdown.style.display = "none";
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

  // Update UI based on auth state
  onAuthStateChanged(auth, (user) => {
    updateUI(user, accountContainer, loginButton, accountProfile, accountId);
  });
}

/* ------------------ UPDATE UI FUNCTION ------------------ */
function updateUI(user, accountContainer, loginButton, accountProfile, accountId) {
  if (user) {
    const displayName = user.displayName || user.email || "User";
    const initials = displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    accountProfile.textContent = initials;
    accountId.textContent = displayName;

    accountContainer.classList.remove("hide");
    loginButton.classList.add("hide");
  } else {
    accountContainer.classList.add("hide");
    loginButton.classList.remove("hide");
    accountProfile.textContent = "";
    accountId.textContent = "";
  }
}

/* ------------------ RUN ------------------ */
initNavbarAuth();
