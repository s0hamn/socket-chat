const socket = io();
const chatForm = document.getElementById('chatForm');
const container = document.querySelector('.container');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
container.scrollTop = container.scrollHeight;

socket.emit('join-room', { username, room });

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.msgText.value;

    // Emit message to server

    socket.emit('chatMessage', message);
    e.target.elements.msgText.value = "";
    e.target.elements.msgText.focus();
});


socket.on('message', (message) => {
    const container = document.querySelector('.container');
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerText = `${message.username}: ${message.message}`;

    container.querySelector('ul').appendChild(li);
    container.scrollTop = container.scrollHeight;

});

socket.on('new-user', (message) => {
    const container = document.querySelector('.container');
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.classList.add('active');
    li.innerText = `${message.username}: ${message.message}`;

    container.querySelector('ul').appendChild(li);
    container.scrollTop = container.scrollHeight;

});

