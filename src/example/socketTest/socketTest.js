var io = require('socket.io-client');
var EventEmitter = require('wolfy87-eventemitter');

var eventEmitter = new EventEmitter();
var playerId;
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

socket.on('playerAssignRequest', function (data) {
    console.log('playerAssignRequest', data);

    if (typeof playerId !== 'undefined') {
        console.log('Ignoring playerAssignRequest as player has been assigned already');
        return;
    }

    if (confirm('Agree to be player ' + data.playerId)) {
        socket.emit('playerAssignResponse', {
            userSelection: true,
            playerId: data.playerId
        });
    }
});

socket.on('playerAssign', function (data) {
    console.log('playerAssign', data);

    playerId = data.playerId;

    eventEmitter.emit('playerAssign', data);
});

socket.on('playerMove', function (data) {
    console.log('playerMove', data);
    eventEmitter.emit('playerMove', data);
});

function playerMove(move) {
    console.log('playerMove', move);
    socket.emit('playerMove', move)
}


module.exports = {
    on: eventEmitter.on.bind(eventEmitter),
    emit: eventEmitter.emit.bind(eventEmitter),
    getPlayerId: () => playerId,
    playerMove
};