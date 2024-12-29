document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = './studentlogin.html';
        });
    }
});

const eventsData = [
    {
        id: 1,
        title: "The Accessible Target Sizes Cheatsheet",
        date: "2024-06-25",
        location: "United Kingdom",
        image: "./images/Link → event_thumb01.jpg.png",
    },
];

document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    const eventsPerPage = 8;
    let filteredEvents = [...eventsData];

    initializeEventCards();
    setupPagination();
    setupSearch();
    setupFilters();
    initializeAnimations();
});

function initializeEventCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });

        card.addEventListener('click', () => {
            const eventTitle = card.querySelector('h3').textContent;
            window.location.href = `event-details.html?event=${encodeURIComponent(eventTitle)}`;
        });
    });
}

function setupPagination() {
    const pageButtons = document.querySelectorAll('.page-btns button');
    const arrowButton = document.querySelector('.arrow button');
    
    pageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const newPage = parseInt(e.target.textContent);
            if (newPage !== currentPage) {
                updateActivePage(newPage);
                loadEventsForPage(newPage);
            }
        });
    });

    if (arrowButton) {
        arrowButton.addEventListener('click', () => {
            const nextPage = currentPage < totalPages ? currentPage + 1 : 1;
            updateActivePage(nextPage);
            loadEventsForPage(nextPage);
        });
    }
}



