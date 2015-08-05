var socket = io();

var username = prompt("Enter a username: ");

var needToSend = true;

setInterval(function() {
  if (username && needToSend) {
    socket.emit('sending username', username);
    needToSend = false;
  }
}, 3000);

/* user typing */

socket.on('typing', function(user) {
  $('#typing').text(user + " is typing...");
});

setInterval(function() {
  $('#typing').empty();
}, 3000);

setInterval(function() {
  $('form').on('input', function() {
    socket.emit('typing', username);
  });
}, 1000);

/* submit message */

$('form').submit(function() {
  socket.emit('send message', username + ': ' + $('#m').val());
  $('#messages').append($('<li>').text(username + ': ' + $('#m').val()));
  $('#m').val('');
  return false;
});

/* update display */

socket.on('receive message', function(msg) {
  $('#typing').empty();
  $('#messages').append($('<li>').text(msg));
});

socket.on('update list', function(users) {
  $('#onlineUsers').empty();
  users.forEach(function(user) {
    $('#onlineUsers').append($('<li>').text(user));
  })
})
