import { app } from "./lib/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const auth = getAuth(app);

const accountContainer = document.querySelector(".account");
const accountProfile = document.getElementById("account__profile");
const accountId = document.getElementById("account__id");
const loginButton = document.getElementById("account__login");

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
signOutDropdown.style.display = "none";
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
function updateUI(user) {
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

onAuthStateChanged(auth, (user) => {
  updateUI(user);
});
