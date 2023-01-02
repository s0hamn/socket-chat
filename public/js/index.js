const submitBtn = document.getElementById('submit');
const joinRoom = document.getElementById('join-room');

joinRoom.addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    if (username) {
        window.location.href = `/chat.html?username=${username}&room=${joinRoom.getAttribute('data-room')}`;
    } else {
        alert("Please enter a username");
    }
});