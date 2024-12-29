const form = document.querySelector('form');
const firstName = document.getElementById('first-name1');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const errorContainer = document.getElementById('error-container');

const showError = (message) => {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
};

const clearError = () => {
    errorContainer.textContent = '';
    errorContainer.style.display = 'none';
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    if (!firstName.value.trim()) {
        showError('First name is required');
        firstName.focus();
        return;
    }

    if (!lastName.value.trim()) {
        showError('Last name is required');
        lastName.focus();
        return;
    }

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

    if (!isStrongPassword(password.value)) {
        showError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
        password.focus();
        return;
    }

    if (!confirmPassword.value) {
        showError('Please confirm your password');
        confirmPassword.focus();
        return;
    }

    if (password.value !== confirmPassword.value) {
        showError('Passwords do not match');
        confirmPassword.focus();
        return;
    }

    showSuccess();
});

const inputs = [firstName, lastName, email, password, confirmPassword];

inputs.forEach(input => {
    input.addEventListener('input', () => {
        clearError();
    });
});

password.addEventListener('input', function() {
    if (this.value.length > 0) {
        if (isStrongPassword(this.value)) {
            this.style.borderColor = '#4CAF50';
        } else {
            this.style.borderColor = '#ff9800';
        }
    } else {
        this.style.borderColor = '';
    }
});

const showSuccess = () => {
    errorContainer.style.color = '#4CAF50';
    errorContainer.textContent = 'Registration successful!';
    form.reset();
    setTimeout(() => {
        clearError();
    }, 3000);
};