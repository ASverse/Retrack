// express app creation
const path = require("path");
const express = require("express");
const app = express();

// needed for server creation
const http = require("http");

// runs on http
const socketio = require("socket.io");

// create server
const server = http.createServer(app);

// configure socket.io with http sever
const io = socketio(server);

// for the fe
app.set("view engine", "ejs");
// for images or static htmls
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("index");
});

const users = {};

const users = {};

io.on("connection", (socket) => {
  socket.emit("existing-users", users);

  socket.on("send-location", (data) => {
    const user = {
      id: socket.id,
      ...data,
    };
    users[socket.id] = user;
    io.emit("receive-location", user);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("user-disconnected", socket.id);
  });
});

server.listen(3000);
