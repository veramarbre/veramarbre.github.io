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

document
  .querySelectorAll(".product, .about, .contact")
  .forEach((el) => observer.observe(el));

// Sliding menu functionality
const menuIcon = document.querySelector(".menu-icon");
const slidingMenu = document.createElement("div");
slidingMenu.classList.add("sliding-menu");
slidingMenu.innerHTML = `
    <div class="close-icon" aria-label="Close Menu">
        <i class="fas fa-times"></i>
    </div>
    <ul>
        <li><a href="#home" data-i18n="home">Home</a></li>
        <li><a href="/Pages/products.html" data-i18n="products">Products</a></li>
        <li><a href="#about" data-i18n="about">About</a></li>
        <li><a href="#contact" data-i18n="contact">Contact</a></li>
        <li><a href="/Pages/login.html">Admin Panel</a></li>
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
    heroTitle: "Elevate Your Space with Natural Stone",
    heroDescription:
      "Discover the beauty and durability of our premium marble and stone products.",
    exploreCollection: "Explore Our Collection",
    featuredProducts: "Featured Products",
    aboutTitle: "About VERA MARBRE™",
    aboutDescription:
      "We are passionate about providing high-quality marble and stone products that transform spaces. Our commitment to craftsmanship and customer satisfaction sets us apart. With years of experience in the industry, we source the finest materials and employ skilled artisans to create stunning pieces that elevate any environment.",
    showMore: "Show More",
    ourTeam: "Our Team",
    ourMobileApp: "Our Mobile App",
    downloadApp: "Download on Play Store",
    ourPartners: "Our Partners",
    getInTouch: "Get in Touch",
    yourName: "Your Name",
    yourEmail: "Your Email",
    yourMessage: "Your Message",
    sendMessage: "Send Message",
    privacyPolicy: "Privacy Policy",
  },
  fr: {
    home: "Accueil",
    products: "Produits",
    about: "À propos",
    contact: "Contact",
    heroTitle: "Élevez votre espace avec de la pierre naturelle",
    heroDescription:
      "Découvrez la beauté et la durabilité de nos produits en marbre et en pierre de qualité supérieure.",
    exploreCollection: "Explorez notre collection",
    featuredProducts: "Produits en vedette",
    aboutTitle: "À propos de VERA MARBRE™",
    aboutDescription:
      "Nous sommes passionnés par la fourniture de produits en marbre et en pierre de haute qualité qui transforment les espaces. Notre engagement envers l'artisanat et la satisfaction du client nous distingue. Avec des années d'expérience dans l'industrie, nous sélectionnons les meilleurs matériaux et employons des artisans qualifiés pour créer des pièces magnifiques qui élèvent n'importe quel environnement.",
    showMore: "Voir plus",
    ourTeam: "Notre équipe",
    ourMobileApp: "Notre application mobile",
    downloadApp: "Télécharger sur Play Store",
    ourPartners: "Nos partenaires",
    getInTouch: "Contactez-nous",
    yourName: "Votre nom",
    yourEmail: "Votre email",
    yourMessage: "Votre message",
    sendMessage: "Envoyer le message",
    privacyPolicy: "Politique de Confidentialité",
  },
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    about: "حول",
    contact: "اتصل",
    heroTitle: "ارفع مساحتك بالحجر الطبيعي",
    heroDescription: "اكتشف جمال ومتانة منتجاتنا الفاخرة من الرخام والحجر.",
    exploreCollection: "استكشف مجموعتنا",
    featuredProducts: "المنتجات المميزة",
    aboutTitle: "حول VERA MARBRE™",
    aboutDescription:
      "نحن شغوفون بتقديم منتجات عالية الجودة من الرخام والحجر التي تحول المساحات. التزامنا بالحرفية ورضا العملاء يميزنا. مع سنوات من الخبرة في الصناعة، نقوم بتوريد أفضل المواد ونوظف حرفيين مهرة لإنشاء قطع مذهلة ترفع أي بيئة.",
    showMore: "عرض المزيد",
    ourTeam: "فريقنا",
    ourMobileApp: "تطبيقنا المحمول",
    downloadApp: "تنزيل على Play Store",
    ourPartners: "شركاؤنا",
    getInTouch: "ابقى على تواصل",
    yourName: "اسمك",
    yourEmail: "بريدك الإلكتروني",
    yourMessage: "رسالتك",
    sendMessage: "إرسال الرسالة",
    privacyPolicy: "سياسة الخصوصية",
  },
};

// Initialize language based on user's preference or default to English
const userLang = navigator.language.slice(0, 2);
changeLanguage(translations[userLang] ? userLang : "en");

document
  .getElementById("play-store-button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    alert("Coming soon");
  });

window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    // Adjust the scroll value as needed
    header.classList.add("floating");
  } else {
    header.classList.remove("floating");
  }
});

// Cookie Consent functionality
document.addEventListener("DOMContentLoaded", () => {
  const cookieConsent = document.getElementById("cookie-consent");
  const acceptCookiesButton = document.getElementById("accept-cookies");
  const declineCookiesButton = document.getElementById("decline-cookies");

  // Show the cookie consent toast if not already accepted
  if (!localStorage.getItem("cookiesAccepted")) {
    setTimeout(() => {
      cookieConsent.classList.add("show");
    }, 500); // Delay to show the toast with animation
  }

  // Handle the accept cookies button click
  acceptCookiesButton.addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "true");
    cookieConsent.classList.remove("show");
  });

  // Handle the decline cookies button click
  declineCookiesButton.addEventListener("click", () => {
    cookieConsent.classList.remove("show");
  });
});
