document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = './studentlogin.html';
        });
    }
});

const form = document.querySelector('form');
const nameInput = form.querySelector('input[type="text"]');
const emailInput = form.querySelector('input[type="email"]');
const websiteInput = form.querySelectorAll('input[type="text"]')[1];
const messageInput = form.querySelector('textarea');

const errorContainer = document.createElement('div');
errorContainer.style.cssText = `
    color: red;
    font-size: 14px;
    margin-top: 10px;
    text-align: center;
`;
form.insertBefore(errorContainer, form.querySelector('.subBtn'));

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

const isValidWebsite = (url) => {
    if (!url) return true; 
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    return urlRegex.test(url);
};

const addInputFeedback = (input) => {
    input.addEventListener('focus', () => {
        input.style.borderColor = '#007bff';
    });

    input.addEventListener('blur', () => {
        if (input.value.trim()) {
            input.style.borderColor = '#28a745';
        } else {
            input.style.borderColor = '';
        }
    });

    input.addEventListener('input', () => {
        clearError();
    });
};

[nameInput, emailInput, websiteInput, messageInput].forEach(addInputFeedback);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    if (!nameInput.value.trim()) {
        showError('Name is required');
        nameInput.focus();
        return;
    }

    if (!emailInput.value.trim()) {
        showError('Email is required');
        emailInput.focus();
        return;
    }

    if (!isValidEmail(emailInput.value)) {
        showError('Please enter a valid email address');
        emailInput.focus();
        return;
    }

    if (websiteInput.value && !isValidWebsite(websiteInput.value)) {
        showError('Please enter a valid website URL');
        websiteInput.focus();
        return;
    }

    if (!messageInput.value.trim()) {
        showError('Message is required');
        messageInput.focus();
        return;
    }

    if (messageInput.value.trim().length < 10) {
        showError('Message must be at least 10 characters long');
        messageInput.focus();
        return;
    }

    const successMessage = document.createElement('div');
    successMessage.textContent = 'Message sent successfully!';
    successMessage.style.cssText = `
        color: #28a745;
        font-size: 14px;
        margin-top: 10px;
        text-align: center;
    `;
    errorContainer.replaceWith(successMessage);

    form.reset();

    setTimeout(() => {
        successMessage.remove();
    }, 3000);
});