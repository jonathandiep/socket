var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var onlineList = [];

io.on('connection', function(socket) {
  console.log('connected: ' + socket.id);

  socket.on('sending username', function(username) {
    onlineList.push({id:socket.id, user:username});
    console.log(onlineList);

    var users = onlineList.map(function(thing) {
      return thing.user;
    });
    console.log(users);

    io.emit('update list', users);
  });

  socket.on('disconnect', function() {
    console.log('disconnected: ' + socket.id);
    onlineList = onlineList.filter(function(data) {
      return data.id !== socket.id;
    });
    console.log(onlineList);

    var users = onlineList.map(function(thing) {
      return thing.user;
    });
    console.log(users);

    io.emit('update list', users);
  });

  socket.on('send message', function(msg) {
    socket.broadcast.emit('receive message', msg);
  });

  socket.on('typing', function(user) {
    socket.broadcast.emit('typing', user);
  });

});

http.listen(port);
console.log('working on port ' + port);
