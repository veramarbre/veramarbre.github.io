import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, get, set, push, remove } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

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
const database = getDatabase(app);
const auth = getAuth(app);

// Fetch products from Firebase Realtime Database
async function fetchProducts() {
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.style.display = "block"; // Show loading spinner

    const dbRef = ref(database, "products");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        const products = snapshot.val();
        renderProducts(products);
        setupSearch(products);
    } else {
        console.log("No data available");
    }

    loadingSpinner.style.display = "none"; // Hide loading spinner
}


// Render products in the HTML
function renderProducts(products) {
    const productGrid = document.getElementById("productGrid");
    productGrid.innerHTML = ""; // Clear existing content
    for (const key in products) {
        if (products.hasOwnProperty(key)) {
            const product = products[key];
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");
            productDiv.innerHTML = `
        <img src="${product.image_url}" alt="${product.description || 'Product Image'}" loading="lazy" />
        <h3>${product.name || 'Unnamed Product'}</h3>
        <div class="product-actions">
          <i class="fas fa-edit edit-icon" data-id="${key}" data-tooltip="Edit"></i>
          <i class="fas fa-trash delete-icon" data-id="${key}" data-tooltip="Delete"></i>
        </div>
      `;
            productGrid.appendChild(productDiv);
        }
    }

    // Add event listeners for edit and delete icons
    document.querySelectorAll('.edit-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            showEditForm(productId, products[productId]);
        });
    });

    document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            showConfirmationCard(productId);
        });
    });

    function showConfirmationCard(productId) {
        const overlay = document.getElementById('confirmationOverlay');
        overlay.style.display = 'flex';

        document.getElementById('confirmDeleteButton').onclick = () => {
            deleteProduct(productId);
            hideConfirmationCard();
        };

        document.getElementById('cancelDeleteButton').onclick = hideConfirmationCard;
    }

    function hideConfirmationCard() {
        const overlay = document.getElementById('confirmationOverlay');
        overlay.style.display = 'none';
    }


    // Check authentication status and show/hide icons
    updateIconVisibility();

}

// New function to update icon visibility
function updateIconVisibility() {
    const user = auth.currentUser;
    const productActions = document.querySelectorAll('.product-actions');
    productActions.forEach(action => {
        action.style.display = user ? 'block' : 'none';
    });
}

// Setup search functionality
function setupSearch(products) {
    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filteredProducts = {};
        for (const key in products) {
            if (products.hasOwnProperty(key)) {
                const product = products[key];
                if (product.name.toLowerCase().includes(query) || product.name.toLowerCase().includes(query)) {
                    filteredProducts[key] = product;
                }
            }
        }
        renderProducts(filteredProducts);
    });
}

// Show form for adding a new product
document.getElementById('addButton').addEventListener('click', () => {
    showAddForm();
});

document.getElementById('submitProductButton').addEventListener('click', () => {
    const productId = document.getElementById('productForm').getAttribute('data-id');
    if (productId) {
        updateProduct(productId);
    } else {
        addProduct();
    }
});

document.getElementById('closeFormIcon').addEventListener('click', () => {
    hideForm();
});

function showAddForm() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('productForm').style.display = 'block';
    document.getElementById('formTitle').innerText = 'Add Product';
    document.getElementById('productForm').removeAttribute('data-id');
    clearForm();
}

function showEditForm(productId, product) {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('productForm').style.display = 'block';
    document.getElementById('formTitle').innerText = 'Edit Product';
    document.getElementById('productForm').setAttribute('data-id', productId);
    document.getElementById('productName').value = product.name;
    document.getElementById('productImage').value = product.image_url;
    document.getElementById('productCountry').value = product.country;
    document.getElementById('productDetails').value = product.details;
    document.getElementById('productPrice').value = product.price;
}

function clearForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productCountry').value = '';
    document.getElementById('productDetails').value = '';
    document.getElementById('productPrice').value = '';
}

async function addProduct() {
    const newProduct = {
        name: document.getElementById('productName').value,
        image_url: document.getElementById('productImage').value,
        country: document.getElementById('productCountry').value,
        details: document.getElementById('productDetails').value,
        price: document.getElementById('productPrice').value,
    };

    const dbRef = ref(database, 'products');
    const newProductRef = push(dbRef);
    await set(newProductRef, newProduct);
    fetchProducts();
    hideForm();
}

async function updateProduct(productId) {
    const updatedProduct = {
        name: document.getElementById('productName').value,
        image_url: document.getElementById('productImage').value,
        country: document.getElementById('productCountry').value,
        details: document.getElementById('productDetails').value,
        price: document.getElementById('productPrice').value,
    };

    const dbRef = ref(database, `products/${productId}`);
    await set(dbRef, updatedProduct);
    fetchProducts();
    hideForm();
}

async function deleteProduct(productId) {
    const dbRef = ref(database, `products/${productId}`);
    await remove(dbRef);
    fetchProducts();
}

function hideForm() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('productForm').style.display = 'none';
}

// Fetch and render products on page load
fetchProducts();


// Modify the onAuthStateChanged listener
onAuthStateChanged(auth, (user) => {
    const addButton = document.getElementById('addButton');
    if (user) {
        addButton.style.display = 'inline-block';
    } else {
        addButton.style.display = 'none';
    }

    // Update icon visibility whenever auth state changes
    updateIconVisibility();
});


     // Lottie Animation
var animation = bodymovin.loadAnimation({
    container: document.getElementById('loadingSpinner'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://lottie.host/fd7be200-989d-4d08-b9b9-158bf2f66824/sNknZbizci.json' // lottie file path
  })