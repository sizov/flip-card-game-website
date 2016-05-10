var io = require('socket.io-client');

var connected = false;
var socket = io();

// Sends a chat message
function sendMessage(text) {
    console.log('Sending', text);

    // if there is a non-empty message and a socket connection
    if (text) {
        // tell server to execute 'new message' and send along one parameter
        socket.emit('new message', text);
    }
}

// Adds the visual chat message to the message list
function addChatMessage(data) {
    console.log('Message arrived:', data);
}

// Whenever the server emits 'new message', update the chat body
socket.on('new message', function (data) {
    addChatMessage(data);
});

setTimeout(function () {
    sendMessage('Hello!');
}, 2000);