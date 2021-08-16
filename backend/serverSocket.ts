const ioInit = function (server, passport, sessionStore) {
  const {
    getStudentQueuePosition,
    getDemonstratorsAssociatedStudents,
    getAssignedDemFromStudentUsername,
    createAllChats,
    getStudentPosition,
    updateStudentsOnQueuePosition,
  } = require("./utils");
  const { Message } = require("./classes");
  const {
    getAllLiveTickets,
    findOneUser,
    getStudentsLiveTicket,
    changeTicketDemonstrator,
    changeTicketStatus,
  } = require("./dao");
  const { getDemonstratorChatKeys } = require("./utils");
  require("dotenv").config();
  const session = require("express-session"); // need for sessions

  const path = require("path"),
    fs = require("fs"),
    mime = require("mime"),
    siofu = require("socketio-file-upload");

  var chats = { demonstratorChat: [] };

  const { Server } = require("socket.io");
  const io = new Server(server, {
    cors: {
      origin: [process.env.REACT_APP_CORS],
      credentials: true,
    },
    secure: true,
    path: "/socket.io",
  });

  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);
  io.use(
    wrap(
      session({
        store: sessionStore,
        secret: process.env.SESSION_SECRET,
        saveUninitialized: true,
        resave: true,
        name: process.env.COOKIE_NAME,
      })
    )
  );
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));
  io.use((socket, next) => {
    if (socket.request.user) {
      next();
    } else {
      next(new Error("unauthorized"));
    }
  });

  io.use((socket, next) => {
    // const username = socket.handshake.auth.username;
    const username = socket.request.user.username;

    if (!username) {
      console.log("invalid username");
      return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
  });

  // Run when client connects
  io.on("connection", async (socket) => {
    console.log(`new connection '${socket.username}' - id: ${socket.id}`);
    const username = socket.username;
    socket.join(username);
    const user = await findOneUser(username);

    if (user.role === "student") {
      const studentsTicket = await getStudentsLiveTicket(username);
      io.to(username).emit(
        "studentPosition",
        getStudentPosition(studentsTicket)
      );
      if (!chats.hasOwnProperty(username)) {
        chats[username] = [];
      }
    } else {
      io.to("demonstratorChat").emit(
        "chatKeys",
        getDemonstratorChatKeys(await getAllLiveTickets())
      );
    }

    var uploader = new siofu();
    uploader.dir = __dirname + "/chatFiles";
    uploader.listen(socket);

    // Do something when a file is saved:
    uploader.on("saved", function (event) {
      console.log(
        `'${username}' succesfully uploaded file to '${uploader.dir}'.`
      );

      const filePath = event.file.pathName;
      fs.readFile(filePath, async function (err, data) {
        const chatKey =
          user.role === "student" ? username : event.file.meta.chat;
        const fileName = path.basename(filePath);
        const mimetype = mime.lookup(filePath);

        const message = mimetype.includes("image")
          ? new Message(
              "image",
              username,
              "",
              chatKey,
              "data:image/png;base64," + data.toString("base64"),
              fileName
            )
          : new Message("file", username, "", chatKey, undefined, fileName);

        // add new message to relevant chat
        if (!chats.hasOwnProperty(chatKey)) {
          chats[chatKey] = [];
        }
        chats[chatKey].push(message);
        io.to(chatKey).emit("sendMessagesToClient", chats[chatKey]);
        const liveTickets = await getAllLiveTickets();
        io.to(username).emit("sendChatsToClient", chats);

        chatKey !== "demonstratorChat" &&
          io
            .to(getAssignedDemFromStudentUsername(chatKey, liveTickets))
            .emit("sendChatsToClient", chats);
      });
    });

    // Error handler:
    uploader.on("error", function (event) {
      console.log("File upload error:", event);
    });

    if (user.role !== "student") {
      for (let studentUsername of await getDemonstratorsAssociatedStudents(
        username,
        await getAllLiveTickets()
      )) {
        socket.join(studentUsername);
      }
      socket.join("demonstratorChat");
    }

    socket.on("getMessages", async (requestedChat) => {
      if (user.role === "student") {
        io.to(socket.username).emit(
          "sendMessagesToClient",
          chats[socket.username]
        );
      } else {
        io.to("demonstratorChat").emit(
          "chatKeys",
          getDemonstratorChatKeys(await getAllLiveTickets())
        );
        if (requestedChat === undefined) {
          createAllChats(chats, await getAllLiveTickets());
          io.to(username).emit("sendChatsToClient", chats);
        } else {
          io.to(requestedChat).emit(
            "sendMessagesToClient",
            chats[requestedChat]
          );
        }
      }
    });

    socket.on("sendMessageToServer", async (message) => {
      const chatKey = user.role === "student" ? username : message.chat;
      socket.join(chatKey);
      message =
        message.type === "videoInvite"
          ? new Message("videoInvite", username, "", chatKey)
          : new Message("text", username, message.text, chatKey);

      // add new message to relevant chat

      if (!chats.hasOwnProperty(chatKey)) {
        chats[chatKey] = [];
      }
      chats[chatKey].push(message);
      //send new array of messages to client
      io.to(chatKey).emit("sendMessagesToClient", chats[chatKey]);

      io.to("demonstratorChat").emit("sendChatsToClient", chats);

      if (user.role !== "student" && chatKey !== "demonstratorChat") {
        let studentsTicket = await getStudentsLiveTicket(chatKey);
        if (studentsTicket.demonstratorUsername === null) {
          const changeAttempt = await changeTicketDemonstrator(
            studentsTicket.id,
            username
          );
          if (changeAttempt.errno !== undefined) {
            console.log(changeAttempt);
          } else {
            changeTicketStatus(studentsTicket.id, "inProgress")
              .then(async () => {
                const liveTickets = await getAllLiveTickets();
                io.emit("sendTicketsToClients", liveTickets);
                io.to(chatKey).emit("demonstratorAssigned", username);
                io.to("demonstratorChat").emit(
                  "chatKeys",
                  getDemonstratorChatKeys(liveTickets)
                );
                updateStudentsOnQueuePosition(io, liveTickets);
                io.to(chatKey).emit(
                  "studentPosition",
                  getStudentPosition("inProgress")
                );
              })
              .catch((e) => console.log(e));
          }
        }
      }
    });

    socket.on("getQueuePosition", async () => {
      io.to(username).emit(
        "updateTicketsRemaining",
        `${getStudentQueuePosition(username, await getAllLiveTickets())}`
      );
    });

    socket.on("typing", async (chatKey: string) => {
      const key = user.role === "student" ? username : chatKey;
      socket.broadcast.emit("typing", key);
      //console.log(`${username} is typing`);
    });

    socket.on("getTickets", async () => {
      if (user.role !== "student") {
        socket.emit("sendTicketsToClients", await getAllLiveTickets());
      }
    });

    socket.on("joinCall", async (studentName) => {
      const callKey = "v" + (user.role === "student" ? username : studentName);
      socket.join(callKey);
      if (user.role === "student") {
        chats[username] = chats[username].filter(
          (message) => message.type !== "videoInvite"
        );
        io.to(username).emit("sendMessagesToClient", chats[username]);
      }
      setTimeout(() => {
        socket.to(callKey).emit("user-connected", username);
      }, 500);
      console.log(`${username} joined room: '${callKey}'`);
    });

    socket.on("leaveCall", async (studentName) => {
      const callKey = "v" + (user.role === "student" ? username : studentName);
      socket.leave(callKey);
      setTimeout(
        () => socket.to(callKey).emit("user-disconnected", username),
        500
      );
      console.log(`${username} left room: '${callKey}'`);
    });
  });

  return io;
};

exports.ioInit = ioInit;
