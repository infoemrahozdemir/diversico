const server = require("http").createServer();
const io = require("socket.io")(server);

const PORT = 4000;
const ROOM_ID = 17237128;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event
const UPDATE_USERS_LIST = "updateUserList";
const USER_LOGIN = "userLogin";

let activeSockets = [];

io.on("connection", (socket) => {
  
  // Join a conversation
  console.log("user connected to socket : ", socket.id);

  socket.join(ROOM_ID);
  console.log("user joined to chat room..");

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    console.log("new message :", data);
    io.in(ROOM_ID).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });
  socket.on(USER_LOGIN, (data) => {
    console.log("user login :", data, socket.id);

    const existingSocket = activeSockets.find(
      existingSocket => existingSocket.socketId === socket.id
    );
  
    if (!existingSocket) {
      activeSockets.push({ userId: data.userId, socketId: socket.id });
  
      socket.emit(UPDATE_USERS_LIST, {
        users: activeSockets.filter(
          existingSocket => existingSocket.socketId !== socket.id
        )
      });
  
      socket.broadcast.emit(UPDATE_USERS_LIST, {
        users: activeSockets
      });
    }

  });


  socket.on("call-user", (data) => {
    const callingUser = activeSockets.find(
      existingSocket => existingSocket.userId === data.to
    );
    if(callingUser){
      socket.to(callingUser.socketId).emit("call-made", {
        offer: data.offer,
        socket: callingUser.socketId,
        from: data.from,
        to: data.to,
      });
    }
  });

  socket.on("make-answer", data => {
    console.log("make-answer", data);
    socket.to(data.to).emit("answer-made", {
      socket: socket.id,
      answer: data.answer
    });
  });

  socket.on("reject-call", data => {
    socket.to(data.from).emit("call-rejected", {
      socket: socket.id
    });
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(ROOM_ID);

    activeSockets = activeSockets.filter(
      existingSocket => existingSocket.socketId !== socket.id
    );
    socket.broadcast.emit(UPDATE_USERS_LIST, {
      users: activeSockets
    });
  });
});

server.listen(PORT, () => {
  console.log(`Socket Server Started... Listening on port ${PORT}`);
});