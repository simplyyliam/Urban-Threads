import { app } from "./firebase";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged 
} from "firebase/auth";

const auth = getAuth(app);

// Elements
const loginBtn = document.querySelector(".login-button");
const emailInput = document.querySelector(".input__field[type='email']");
const passwordInput = document.querySelector(".input__field[type='password']");
const googleButton = document.querySelector(".platform__button[aria-label='Login with Google']");
const signupLink = document.querySelector(".login__signup a");

// Track current mode: login or signup
let authMode = "login";

// Handle "Sign up" link click
signupLink.addEventListener("click", (e) => {
    e.preventDefault();
    authMode = "signup";
    loginBtn.textContent = "Sign Up";

    // Optional: Change header/subtitle text
    const title = document.querySelector(".title");
    const subtitle = document.querySelector(".subtitle");
    if (title) title.textContent = "Create Your Account";
    if (subtitle) subtitle.textContent = "Sign up to Urban Threads";
});

// Handle login/signup button click
loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    try {
        if (authMode === "login") {
            // Login
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            // Signup
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully!");
        }

        // Redirect to home page
        window.location.href = "/index.html";
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

// Google login
googleButton.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
        await signInWithPopup(auth, new GoogleAuthProvider());
        window.location.href = "/index.html";
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

// Optional: Reset button back to login if user is already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        authMode = "login";
        loginBtn.textContent = "Login";
    }
});
