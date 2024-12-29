document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = './studentlogin.html';
        });
    }
});

// Constants and Variables
const API_URL = 'https://api.example.com'; // Replace with actual API endpoint
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const categorySelect = document.querySelector('.search-bar select');
    const loginButton = document.querySelector('.login-btn');
    const cartBadge = document.querySelector('.icon-with-badge .badge');
    const menuLinks = document.querySelectorAll('.menu a');

    // Event Listeners Setup
    setupEventListeners();
    updateBadges();
    initializeHeaderAnimations();
    loadCategories();
});

// Event Listeners Setup Function
function setupEventListeners() {
    // Search Functionality
    const searchBar = document.querySelector('.search-bar input');
    searchBar.addEventListener('input', debounce(handleSearch, 500));

    // Category Selection
    const categorySelect = document.querySelector('.search-bar select');
    categorySelect.addEventListener('change', handleCategoryChange);

    // Login Button
    const loginButton = document.querySelector('.login-btn');
    loginButton.addEventListener('click', handleLogin);

    // Join Event Button
    const joinEventButton = document.querySelector('.join-event-button');
    if (joinEventButton) {
        joinEventButton.addEventListener('click', handleEventJoin);
    }

    // Social Share Buttons
    const socialButtons = document.querySelectorAll('.social-icons a');
    socialButtons.forEach(button => {
        button.addEventListener('click', handleSocialShare);
    });
}

// Search Functionality with Debounce
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

async function handleSearch(event) {
    const searchTerm = event.target.value.trim();
    const selectedCategory = document.querySelector('.search-bar select').value;

    if (searchTerm.length < 3) return;

    try {
        const response = await fetch(`${API_URL}/search?term=${searchTerm}&category=${selectedCategory}`);
        const data = await response.json();
        displaySearchResults(data);
    } catch (error) {
        console.error('Search error:', error);
    }
}

// Category Management
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();
        populateCategorySelect(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function populateCategorySelect(categories) {
    const select = document.querySelector('.search-bar select');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

// Cart Management
const cart = {
    items: [],
    addItem(item) {
        this.items.push(item);
        this.saveToLocalStorage();
        this.updateBadge();
    },
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveToLocalStorage();
        this.updateBadge();
    },
    saveToLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    },
    updateBadge() {
        const badge = document.querySelector('.icon-with-badge .badge');
        badge.textContent = this.items.length;
    }
};

// Event Join Handler
async function handleEventJoin() {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    const eventId = getEventIdFromUrl();
    try {
        const response = await fetch(`${API_URL}/events/${eventId}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            }
        });

        if (response.ok) {
            showSuccessMessage('Successfully joined the event!');
            updateEventCapacity();
        } else {
            throw new Error('Failed to join event');
        }
    } catch (error) {
        showErrorMessage('Failed to join event. Please try again.');
    }
}

// Authentication
function handleLogin() {
    const loginModal = createLoginModal();
    document.body.appendChild(loginModal);
}

function createLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'login-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Login</h2>
            <form id="loginForm">
                <input type="email" placeholder="Email" required>
                <input type="password" placeholder="Password" required>
                <button type="submit">Login</button>
            </form>
        </div>
    `;

    const form = modal.querySelector('#loginForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await authenticateUser(form);
    });

    return modal;
}

// Social Share Implementation
function handleSocialShare(event) {
    event.preventDefault();
    const platform = event.currentTarget.getAttribute('data-platform');
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
}

// Animation and UI Enhancement
function initializeHeaderAnimations() {
    const header = document.querySelector('.main-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('nav-hidden');
        } else {
            header.classList.remove('nav-hidden');
        }

        lastScroll = currentScroll;
    });
}

// Utility Functions
function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showErrorMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Regular Expression Validation
const validators = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    phoneNumber: /^\+?[\d\s-]{10,}$/
};

function validate(type, value) {
    return validators[type].test(value);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadCategories();
    updateBadges();
    initializeHeaderAnimations();

    // Check for stored user session
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUIForLoggedInUser();
    }
});