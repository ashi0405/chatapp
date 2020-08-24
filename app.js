var express = require("express"),
  app = express(),
  server = require("http").createServer(app),
  io = require("socket.io").listen(server);
var usernames = [];

server.listen(process.env.PORT || 3000);
console.log("Server running...");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
  console.log("Socket Connected...");

  socket.on("user", function (data, callback) {
    if (usernames.indexOf(data) != -1) {
      callback(false);
    } else {
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
    }

  });

  function updateUsernames() {
    io.sockets.emit("user", usernames);
  }

  socket.on("message", function (data) {

    io.sockets.emit("message", {
      message: data.message,
      username: socket.username,
    });
  });

  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', data)
  })
  socket.on('not typing', function () {
    socket.broadcast.emit('not typing')


  })

  //Disconnect
  socket.on('disconnect', function (data) {
    if (!socket.username) {
      return;
    }
    usernames.splice(usernames.indexOf(socket.username), 1)
    updateUsernames();
    console.log('socket disconnected')

  })

});
