import { io } from "socket.io-client";

//THIS SHOULD BE "http://localhost:32684" for local or '/' for host

//@ts-ignore
const socket = io(process.env.REACT_APP_SOCKET, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
  //   secure: true,
});

//Code used to attempt to debug the socketio websocket issue
// socket.on("connect", () => {
//   console.log("transport", socket.io.engine.transport.name); // shows polling

//   socket.on("connect_error", function () {
//     console.log("Connection Failed");
//   });

//   socket.io.engine.on("upgrade", () => {
//     console.log("upgradedTransport", socket.io.engine.transport.name); // should upgrade to websockets but wont!
//   });
// });

export default socket;
