// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Smooth scrolling for navigation links
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    window.scrollTo({
      top: targetElement.offsetTop - 80,
      behavior: "smooth",
    });

    // Update active link in navigation
    document
      .querySelectorAll("nav a")
      .forEach((link) => link.classList.remove("active"));
    this.classList.add("active");
  });
});

// Simple fade-in animation for elements on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".product").forEach((el) => observer.observe(el));

// Sliding menu functionality
const menuIcon = document.querySelector(".menu-icon");
const slidingMenu = document.createElement("div");
slidingMenu.classList.add("sliding-menu");
slidingMenu.innerHTML = `
      <div class="close-icon" aria-label="Close Menu">
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

// Dark mode toggle functionality
const darkModeToggle = document.getElementById("dark-mode-toggle");
const darkModeIcon = darkModeToggle.querySelector("i");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  darkModeIcon.classList.toggle("fa-moon", !isDarkMode);
  darkModeIcon.classList.toggle("fa-sun", isDarkMode);
  localStorage.setItem("darkMode", isDarkMode);
});

// Initialize settings based on localStorage
document.addEventListener("DOMContentLoaded", () => {
  const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
  languageSelect.value = savedLanguage;
  changeLanguage(savedLanguage);
  updateMenuPosition(savedLanguage);

  const isDarkMode = JSON.parse(localStorage.getItem("darkMode"));
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    darkModeIcon.classList.replace("fa-moon", "fa-sun");
  } else {
    darkModeIcon.classList.replace("fa-sun", "fa-moon");
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
});

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

// Login functionality
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Logged in as:", user.email);
        window.location.href = "/Pages/Products/products.html"; // Redirect to products page
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error logging in:", errorCode, errorMessage);
        alert("Login failed. Please check your credentials and try again.");
      });
  });
}
