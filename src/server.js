const server = require("http").createServer();
const io = require("socket.io")(server);

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const ROOM_ID = 17237128;

io.on("connection", (socket) => {
  
  // Join a conversation
  console.log("user connected to socket");

  socket.join(ROOM_ID);
  console.log("user joined to chat room..");

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    console.log("new message :", data);
    io.in(ROOM_ID).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(ROOM_ID);
  });
});

server.listen(PORT, () => {
  console.log(`Socket Server Started... Listening on port ${PORT}`);
});