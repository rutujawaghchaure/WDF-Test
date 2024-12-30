
const pricingToggle = document.getElementById('pricingToggle');
const prices = document.querySelectorAll('.price span');

if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
        prices.forEach(price => {
            const monthly = price.parentElement.dataset.monthly;
            const yearly = price.parentElement.dataset.yearly;
            price.textContent = pricingToggle.checked ? yearly : monthly;
            
            
            price.style.animation = 'none';
            price.offsetHeight; 
            price.style.animation = 'fadeIn 0.5s';
        });
    });
}


let draggedCard = null;
const columns = document.querySelectorAll('.column');
const addCardButtons = document.querySelectorAll('.add-card');
const editModal = document.getElementById('editModal');
const cardTitleInput = document.getElementById('cardTitle');
const cardLabelSelect = document.getElementById('cardLabel');
const cardDescriptionTextarea = document.getElementById('cardDescription');
const saveCardButton = document.getElementById('saveCard');
const closeModalButton = document.getElementById('closeModal');


loadBoardState();


if (columns) {
    columns.forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
        });

        column.addEventListener('drop', e => {
            e.preventDefault();
            if (draggedCard) {
                column.insertBefore(draggedCard, column.querySelector('.add-card'));
                saveBoardState();
            }
        });
    });
}


if (addCardButtons) {
    addCardButtons.forEach(button => {
        button.addEventListener('click', () => {
            openEditModal();
            saveCardButton.onclick = () => {
                const card = createCard(cardTitleInput.value, cardLabelSelect.value, cardDescriptionTextarea.value);
                button.parentElement.insertBefore(card, button);
                closeEditModal();
                saveBoardState();
            };
        });
    });
}


function editCard(card) {
    openEditModal();
    cardTitleInput.value = card.querySelector('h3').textContent;
    cardLabelSelect.value = card.dataset.label || '';
    cardDescriptionTextarea.value = card.querySelector('p').textContent;

    saveCardButton.onclick = () => {
        card.querySelector('h3').textContent = cardTitleInput.value;
        card.dataset.label = cardLabelSelect.value;
        card.querySelector('p').textContent = cardDescriptionTextarea.value;
        closeEditModal();
        saveBoardState();
    };
}

// Create card
function createCard(title, label, description) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.dataset.label = label;
    card.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
    `;

    card.addEventListener('dragstart', () => {
        draggedCard = card;
    });

    card.addEventListener('dragend', () => {
        draggedCard = null;
    });

    card.addEventListener('click', () => {
        editCard(card);
    });

    return card;
}

// Modal functions
function openEditModal() {
    editModal.style.display = 'block';
}

function closeEditModal() {
    editModal.style.display = 'none';
    cardTitleInput.value = '';
    cardLabelSelect.value = '';
    cardDescriptionTextarea.value = '';
}

if (closeModalButton) {
    closeModalButton.addEventListener('click', closeEditModal);
}

// Save and load board state
function saveBoardState() {
    const boardState = {};
    columns.forEach(column => {
        const columnId = column.id;
        boardState[columnId] = [];
        column.querySelectorAll('.card').forEach(card => {
            boardState[columnId].push({
                title: card.querySelector('h3').textContent,
                label: card.dataset.label,
                description: card.querySelector('p').textContent
            });
        });
    });
    localStorage.setItem('kanbanBoardState', JSON.stringify(boardState));
}

function loadBoardState() {
    const savedState = localStorage.getItem('kanbanBoardState');
    if (savedState) {
        const boardState = JSON.parse(savedState);
        columns.forEach(column => {
            const columnId = column.id;
            if (boardState[columnId]) {
                boardState[columnId].forEach(cardData => {
                    const card = createCard(cardData.title, cardData.label, cardData.description);
                    column.insertBefore(card, column.querySelector('.add-card'));
                });
            }
        });
    }
}

// Add keydown event listener for closing modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && editModal.style.display === 'block') {
        closeEditModal();
    }
});

// Add animation for new cards
function animateNewCard(card) {
    card.style.animation = 'fadeIn 0.5s';
}

// Update createCard function to include animation
function createCard(title, label, description) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.dataset.label = label;
    card.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
    `;

    card.addEventListener('dragstart', () => {
        draggedCard = card;
    });

    card.addEventListener('dragend', () => {
        draggedCard = null;
    });

    card.addEventListener('click', () => {
        editCard(card);
    });

    animateNewCard(card);
    return card;
}

// Add function to clear all cards (for testing purposes)
function clearAllCards() {
    columns.forEach(column => {
        const cards = column.querySelectorAll('.card');
        cards.forEach(card => card.remove());
    });
    saveBoardState();
}


loadBoardState();