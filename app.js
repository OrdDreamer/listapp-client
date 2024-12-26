const SERVER_URL = 'http://localhost:5000'; // Змінити на вашу адресу сервера

const tg = window.Telegram.WebApp;
tg.expand(); // Розгортає міні-додаток на весь екран

// Елементи DOM
const registerBtn = document.getElementById('registerBtn');
const nicknameInput = document.getElementById('nickname');
const statusDiv = document.getElementById('status');
const usersListDiv = document.getElementById('usersList');
const usersUl = document.getElementById('users');

// Поточний користувач
let currentUser = null;

// Реєстрація користувача
registerBtn.addEventListener('click', async () => {
    const nickname = nicknameInput.value.trim();
    if (!nickname) return alert('Please enter a nickname');

    const response = await fetch(`${SERVER_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
    });

    const result = await response.json();
    if (response.ok) {
        currentUser = nickname;
        nicknameInput.style.display = 'none';
        registerBtn.style.display = 'none';
        statusDiv.style.display = 'block';
        usersListDiv.style.display = 'block';
        fetchUsers();
    } else {
        alert(result.error);
    }
});

// Оновлення статусу
document.querySelectorAll('[name="status"]').forEach((radio) => {
    radio.addEventListener('change', async () => {
        const status = radio.value;

        const response = await fetch(`${SERVER_URL}/update_status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname: currentUser, status }),
        });

        if (!response.ok) {
            alert('Failed to update status');
        }
    });
});

// Отримання списку користувачів
async function fetchUsers() {
    const response = await fetch(`${SERVER_URL}/users`);
    const users = await response.json();

    usersUl.innerHTML = '';
    for (const [nickname, data] of Object.entries(users)) {
        const li = document.createElement('li');
        li.textContent = `${nickname}: ${data.status}`;
        usersUl.appendChild(li);
    }

    setTimeout(fetchUsers, 5000); // Оновлювати кожні 5 секунд
}
