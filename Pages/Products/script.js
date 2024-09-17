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
      <ul>
          <li><a href="/index.html#home" data-i18n="home">Home</a></li>
          <li><a href="/Pages/Products/products.html" data-i18n="products">Products</a></li>
          <li><a href="/index.html#about" data-i18n="about">About</a></li>
          <li><a href="/index.html#contact" data-i18n="contact">Contact</a></li>
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
  },
  fr: {
    home: "Accueil",
    products: "Produits",
    about: "À propos",
    contact: "Contact",
    ourProducts: "Nos Produits",
    search: "Chercher",
  },
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    about: "حول",
    contact: "اتصل",
    ourProducts: "منتجاتنا",
    search: "بحث",
  },
};

// Initialize language based on user's preference or default to English
const userLang = navigator.language.slice(0, 2);
changeLanguage(translations[userLang] ? userLang : "en");

window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("floating");
  } else {
    header.classList.remove("floating");
  }
});

// Search functionality
const searchBox = document.querySelector(".search-box input");
const productGrid = document.querySelector(".product-grid");
const products = document.querySelectorAll(".product");

searchBox.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  products.forEach((product) => {
    const productName = product.querySelector("h3").textContent.toLowerCase();
    if (productName.includes(searchTerm)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
});
