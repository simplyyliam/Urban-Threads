import { app } from "./lib/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initSearch } from "./lib/search";
import "./styles/navbar.css";
import "./styles/footer.css";

const auth = getAuth(app);

// dynamically laods the navbar and footer on every page
async function loadLayout() {
  try {
    // Load navbar
    const navbar = await fetch("/components/navbar.html").then((res) =>
      res.text()
    );
    document.body.insertAdjacentHTML("afterbegin", navbar);

    // Load footer
    const footer = await fetch("/components/footer.html").then((res) =>
      res.text()
    );
    document.body.insertAdjacentHTML("beforeend", footer);
  } catch (error) {
    console.error("Error loading layout", error);
  }
}

async function initNavbarAuth() {
  await loadLayout();
  initSearch();

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
  signOutDropdown.textContent = "Sign Out";
  accountContainer.appendChild(signOutDropdown);

  // Toggle dropdown when a user clicks on the profile
  accountProfile.addEventListener("click", (e) => {
    e.stopPropagation();
    signOutDropdown.classList.toggle("open");
  });

  // Hide dropdown if clicked outside
  document.addEventListener("click", (e) => {
    if (!accountContainer.contains(e.target)) {
      signOutDropdown.classList.remove("open");
    }
  });

  // Sign out logic
  signOutDropdown.addEventListener("click", async () => {
    try {
      await signOut(auth);
      signOutDropdown.classList.remove("open");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

  // Update UI on auth state change
  onAuthStateChanged(auth, (user) => {
    updateUI(user, accountContainer, loginButton, accountProfile, accountId);
  });
}


// Updates the UI based on user authentication state
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

initNavbarAuth();
