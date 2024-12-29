const form = document.querySelector('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const rememberMe = document.querySelector('input[type="checkbox"]');

let errorContainer = document.createElement('div');
errorContainer.id = 'error-container';
errorContainer.style.color = 'red';
errorContainer.style.fontSize = '14px';
errorContainer.style.textAlign = 'center';
errorContainer.style.margiTop = '10px';
form.appendChild(errorContainer);

const showError = (message) => {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    errorContainer.style.marginTop = '10px' ;
};

const clearError = () => {
    errorContainer.textContent = '';
    errorContainer.style.display = 'none';
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    if (!email.value.trim()) {
        showError('Email is required');
        email.focus();
        return;
    }

    if (!isValidEmail(email.value)) {
        showError('Please enter a valid email address');
        email.focus();
        return;
    }

    if (!password.value) {
        showError('Password is required');
        password.focus();
        return;
    }

    if (password.value.length < 8) {
        showError('Password must be at least 8 characters long');
        password.focus();
        return;
    }
    form.reset();
    clearError();
});

const inputs = [email, password];

inputs.forEach(input => {
    input.addEventListener('input', () => {
        clearError();
        input.style.borderColor = ''; 
    });
});
