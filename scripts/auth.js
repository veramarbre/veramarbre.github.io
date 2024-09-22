// admin-login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGthkRpERFT4j4Tw9p3mMII9SHVtfTvOo",
  authDomain: "vera-marbre.firebaseapp.com",
  projectId: "vera-marbre",
  storageBucket: "vera-marbre.appspot.com",
  messagingSenderId: "58963574008",
  appId: "1:58963574008:web:39353c784e3a8b031d0f0d",
  measurementId: "G-KGP6L8PG9M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const authMenuItem = document.getElementById("authMenuItem");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const loginBtn = loginForm.querySelector(".login-btn");
const scanMalwareButton = document.getElementById("scanMalwareButton");
const captchaCanvas = document.getElementById("captchaCanvas");
const captchaInput = document.getElementById("captchaInput");

// Generate CAPTCHA
function generateCaptcha() {
const ctx = captchaCanvas.getContext("2d");
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let captchaText = "";
for (let i = 0; i < 6; i++) {
captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
}

// Set canvas dimensions
captchaCanvas.width = captchaCanvas.offsetWidth;
captchaCanvas.height = 50;

// Clear the canvas
ctx.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);

// Set background
ctx.fillStyle = "#f0f0f0";
ctx.fillRect(0, 0, captchaCanvas.width, captchaCanvas.height);

// Set text style
ctx.font = "bold 24px Arial";
ctx.fillStyle = "#333333";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

// Draw text
ctx.fillText(captchaText, captchaCanvas.width / 2, captchaCanvas.height / 2);

return captchaText;
}

// Call this function when the page loads and when you want to refresh the captcha
let captchaText = generateCaptcha();

// Add event listener for captcha refresh
document.querySelector('.captcha-refresh').addEventListener('click', function() {
captchaText = generateCaptcha();
});
// Toggle password visibility
togglePassword.addEventListener("click", function () {
  const type =
    passwordInput.getAttribute("type") === "password"
      ? "text"
      : "password";
  passwordInput.setAttribute("type", type);
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
});


// Handle login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const captcha = captchaInput.value;

  if (captcha !== captchaText) {
    loginMessage.textContent = "Invalid CAPTCHA. Please try again.";
    loginMessage.style.color = "red";
    loginMessage.classList.add("message-animation");
    captchaText = generateCaptcha(); // Regenerate CAPTCHA
    return;
  }

  // Show loading spinner
  loginBtn.classList.add("loading");
loginBtn.querySelector("i").style.display = "inline-block";

try {
await signInWithEmailAndPassword(auth, email, password);
loginMessage.textContent = "Login successful!";
loginMessage.style.color = "green";
loginMessage.classList.add("message-animation");
} catch (error) {
displayErrorMessage(getErrorMessage(error.code));
// Log failed login attempt
await logFailedLoginAttempt(email, error.code);
} finally {
// Hide loading spinner
loginBtn.classList.remove("loading");
loginBtn.querySelector("i").style.display = "none";
refreshCaptcha();
}
});

// Function to display error message
function displayErrorMessage(message) {
loginMessage.textContent = message;
loginMessage.style.color = "red";
loginMessage.classList.add("message-animation");
}

// Function to refresh captcha
function refreshCaptcha() {
captchaText = generateCaptcha();
captchaInput.value = ""; // Clear the captcha input field
}

// Log failed login attempt
async function logFailedLoginAttempt(email, errorCode) {
  try {
    await addDoc(collection(db, "failedLogins"), {
      email: email,
      errorCode: errorCode,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Error logging failed login attempt: ", e);
  }
}

// Function to handle logout
async function handleLogout() {
try {
await signOut(auth);
loginMessage.textContent = "Logged out successfully!";
loginMessage.style.color = "green";
loginMessage.classList.add("message-animation");
} catch (error) {
loginMessage.textContent = getErrorMessage(error.code);
loginMessage.style.color = "red";
loginMessage.classList.add("message-animation");
}
}

// Add event listener to the sign-out button
const signOutButton = document.getElementById("signOutButton");
signOutButton.addEventListener("click", handleLogout);


// Error message handler
function getErrorMessage(errorCode) {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address. Please check and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
      return "No account found with this email. Please check or create a new account.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again or reset your password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please log in or use a different email.";
    case "auth/weak-password":
      return "Password is too weak. Please use a stronger password.";
    default:
      return "An error occurred. Please try again later.";
  }
}



// Animation for login form
loginForm.classList.add("form-animation");

// Check auth state
onAuthStateChanged(auth, (user) => {
    const loginHeader = document.querySelector(".login-section h2");
    const loginDescription = document.querySelector(
      ".login-section p.login-description"
    );
    const signOutButton = document.getElementById("signOutButton");
    const adminInfo = document.getElementById("adminInfo");
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");
    const authMenuItem = document.getElementById("authMenuItem");

    if (user) {
      // User is signed in
      loginForm.style.display = "none";
      adminInfo.style.display = "block";
      signOutButton.style.display = "block";
      loginHeader.style.display = "none";
      loginDescription.style.display = "none";
     
    } else {
      // User is signed out
      loginForm.style.display = "block";
      loginMessage.textContent = "";
      adminInfo.style.display = "none";
      signOutButton.style.display = "none";
      loginHeader.style.display = "block";
      loginDescription.style.display = "block";

    }
  });