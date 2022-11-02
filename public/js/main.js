const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

// get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io()

// join chat room
socket.emit('joinRoom', { username, room })
// get room and user
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)
})
//message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message)
    chatMessages.scrollTop = chatMessages.scrollHeight //scroll down
})

// send message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let msg = e.target.elements.msg.value
    msg = msg.trim()
    if (!msg) {
        return false
    }
    socket.emit('chatMessage', msg); // emit message text to server
    //clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

// output message to dom
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML =
        `<p class="meta">${message.username}<span>${message.time}</span></p>
        <p class="text">${message.text}</p>`
    document.querySelector('.chat-messages').appendChild(div)
}

// add room name to dom
function outputRoomName() {
    roomName.innerText = room
}

// add users to dom
function outputUsers() {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
