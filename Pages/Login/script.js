// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGthkRpERFT4j4Tw9p3mMII9SHVtfTvOo",
  authDomain: "vera-marbre.firebaseapp.com",
  databaseURL: "https://vera-marbre-default-rtdb.firebaseio.com",
  projectId: "vera-marbre",
  storageBucket: "vera-marbre.appspot.com",
  messagingSenderId: "58963574008",
  appId: "1:58963574008:web:39353c784e3a8b031d0f0d",
  measurementId: "G-KGP6L8PG9M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Function to show toast messages
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Login functionality
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginButton = document.querySelector(".login-button");
    const loginError = document.getElementById("loginError");

    // Show loading animation
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Logged in as:", user.email);
        showToast("Login successful!");
        window.location.href = "/Pages/Products/products.html"; // Redirect to products page
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error logging in:", errorCode, errorMessage);
        loginError.textContent = "Login failed. Please check your credentials and try again.";
        showToast("Login failed. Please check your credentials and try again.");
      })
      .finally(() => {
        // Reset loading animation
        loginButton.innerHTML = 'Login';
      });
  });
}

// Check authentication state
onAuthStateChanged(auth, (user) => {
  const menuItems = document.getElementById("menuItems");
  if (user) {
    // User is signed in
    menuItems.innerHTML += '<li><a href="#" id="signOutButton" data-i18n="signOut">Sign Out</a></li>';
    document.getElementById("signOutButton").addEventListener("click", () => {
      signOut(auth).then(() => {
        location.reload();
      });
    });
  } else {
    // No user is signed in
    menuItems.innerHTML += '<li><a href="/Pages/Login/login.html" data-i18n="login">Login</a></li>';
  }
});

// Show/hide password functionality
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  togglePassword.classList.toggle("fa-eye-slash");
  togglePassword.classList.toggle("fa-eye");
  togglePassword.style.color = type === "password" ? "var(--input-icon-color)" : "var(--button-color)";
});

// Sliding menu functionality
const menuIcon = document.querySelector(".menu-icon");
const slidingMenu = document.createElement("div");
slidingMenu.classList.add("sliding-menu", "left");
slidingMenu.innerHTML = `
  <div class="close-icon left" aria-label="Close Menu">
    <i class="fas fa-times"></i>
  </div>
  <ul id="menuItems">
    <li><a href="../index.html" data-i18n="home">Home</a></li>
    <li><a href="/Pages/Products/products.html" data-i18n="products">Products</a></li>
    <li><a href="../index.html#about" data-i18n="about">About</a></li>
    <li><a href="../index.html#contact" data-i18n="contact">Contact</a></li>
  </ul>
  <div class="menu-bottom">
    <div id="language-switcher">
      <i class="fas fa-globe"></i>
      <select id="language-select" aria-label="Select Language">
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="ar">العربية</option>
      </select>
    </div>
    <div id="dark-mode-toggle">
      <i class="fas fa-moon"></i>
    </div>
  </div>
`;
document.body.appendChild(slidingMenu);

menuIcon.addEventListener("click", () => {
  slidingMenu.classList.toggle("open");
});

document.querySelector(".close-icon").addEventListener("click", () => {
  slidingMenu.classList.remove("open");
});

document.addEventListener("click", (event) => {
  if (!slidingMenu.contains(event.target) && !menuIcon.contains(event.target)) {
    slidingMenu.classList.remove("open");
  }
});

// Language switcher functionality
const languageSelect = document.getElementById("language-select");

languageSelect.addEventListener("change", (event) => {
  const selectedLanguage = event.target.value;
  changeLanguage(selectedLanguage);
  localStorage.setItem("selectedLanguage", selectedLanguage);
  updateMenuPosition(selectedLanguage);
});

function changeLanguage(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = translations[lang][key];
  });
}

function updateMenuPosition(lang) {
  if (lang === "ar") {
    menuIcon.classList.remove("left");
    menuIcon.classList.add("right");
    slidingMenu.classList.remove("left");
    slidingMenu.classList.add("right");
    document.querySelector(".close-icon").classList.remove("right");
    document.querySelector(".close-icon").classList.add("left");
    slidingMenu.querySelector("ul").classList.add("right");
  } else {
    menuIcon.classList.remove("right");
    menuIcon.classList.add("left");
    slidingMenu.classList.remove("right");
    slidingMenu.classList.add("left");
    document.querySelector(".close-icon").classList.remove("left");
    document.querySelector(".close-icon").classList.add("right");
    slidingMenu.querySelector("ul").classList.remove("right");
  }
}

// Example translations object
const translations = {
  en: {
    home: "Home",
    products: "Products",
    about: "About",
    contact: "Contact",
    ourProducts: "Our Products",
    search: "Search",
    signOut: "Sign Out",
    login: "Login",
  },
  fr: {
    home: "Accueil",
    products: "Produits",
    about: "À propos",
    contact: "Contact",
    ourProducts: "Nos Produits",
    search: "Chercher",
    signOut: "Déconnexion",
    login: "Connexion",
  },
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    about: "حول",
    contact: "اتصل",
    ourProducts: "منتجاتنا",
    search: "بحث",
    signOut: "تسجيل الخروج",
    login: "تسجيل الدخول",
  },
};

// Initialize language based on user's preference or default to English
const userLang = navigator.language.slice(0, 2);
changeLanguage(translations[userLang] ? userLang : "en");
