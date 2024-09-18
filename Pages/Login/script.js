
// Show/hide password functionality
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  togglePassword.classList.toggle("fa-eye-slash");
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
