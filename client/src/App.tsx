import React, { useState, useEffect, useRef } from "react";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PostTicketPage from "./pages/PostTicketPage";
import HelpDeskPage from "./pages/HelpDeskPage";
import NavPage from "./pages/MainNav";
import DemonstratorNav from "./pages/DemonstratorNav";
import TicketPostedPage from "./pages/TicketQueuePage";
import AdminPage from "./pages/Admin";
import StudentMessagePage from "./pages/StudentMessagePage";
import DemMessagePage from "./pages/DemMessagePage";
import Activity from "./pages/Activity";
import PrivateRoute from "./PrivateRoute";
import Auth from "./Auth";
import routes from "./Routes";

import { getUsername, isStudent } from "./api/auth";
import socket from "./api/socket";
import SummaryDashboard from "./pages/Summary";
import ModalLabClosed from "./components/ModalLabClosed";
import ModalTicketResolved from "./components/ModalTicketResolved";

const App = withRouter(({ location }) => {
  const [currentUser, setCurrentUser] = useState("");
  const [demUnreadCounts, setDemUnreadCounts] = useState<any>({});
  const [chats, setChats] = useState<any>([]);
  const [myKeys, setMyKeys] = useState<any>([]);
  const [myChats, setMyChats] = useState<any>([]);
  const [readCounts, setReadCounts] = useState<any>({});
  const [selectedChat, setSelectedChat] = useState<any>(undefined);
  const [studentPosition, setStudentPosition] = useState<any>(null);
  const positionRef = useRef();
  positionRef.current = studentPosition;

  function countUnreadMessages(chatKey: string) {
    return readCounts[chatKey]
      ? myChats[chatKey].length - readCounts[chatKey]
      : myChats[chatKey].length;
  }

  function playMessageSound() {
    const messageSound = new Audio("/labs/messageSound.mp3");
    const playPromise = messageSound.play();

    if (playPromise !== undefined) {
      playPromise
        .then((sound: any) => {
          if (sound) {
            sound.currentSrc = null;
            sound.src = "";
            sound.srcObject = null;
            sound.remove();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  const [showLabClosedModal, setShowLabClosedModal] = useState(false);
  const [showTicketResolvedModal, setShowTicketResolvedModal] = useState(false);

  useEffect(() => {
    var newUnreadCounts: any = {};

    for (let chatKey of Object.keys(myChats)) {
      newUnreadCounts[chatKey] = countUnreadMessages(chatKey);
    }

    newUnreadCounts[selectedChat] = 0;

    const newTotalUnread: any =
      newUnreadCounts &&
      Object.values(newUnreadCounts).reduce((a: any, b: any) => a + b, 0);

    const oldTotalUnread: any =
      demUnreadCounts &&
      Object.values(demUnreadCounts).reduce((a: any, b: any) => a + b, 0);

    if (oldTotalUnread < newTotalUnread) {
      playMessageSound();
    }

    setDemUnreadCounts(newUnreadCounts);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myChats, readCounts]);

  useEffect(() => {
    var myNewChats: any = {};

    for (let key of myKeys) {
      chats[key] && (myNewChats[key] = chats[key]);
    }

    myKeys && setMyChats(myNewChats);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats, myKeys]);

  socket.on("chatKeys", (keys: any) => {
    setMyKeys(
      keys.hasOwnProperty(currentUser)
        ? keys[currentUser]
        : ["demonstratorChat"]
    );
  });

  useEffect(() => {
    socket.emit("getMessages");
    socket.on("sendChatsToClient", (newChats: any) => {
      setChats(newChats);
    });

    socket.on("studentPosition", (position: any) => {
      setStudentPosition(position);
    });

    socket.on("labHasClosed", async () => {
      //@ts-ignore
      if ((await isStudent()) && positionRef.current !== "form") {
        setShowLabClosedModal(true);
      }
    });

    socket.on("ticketHasBeenResolved", async () => {
      if (await isStudent()) {
        setShowTicketResolvedModal(true);
      }
    });

    getUsername((resp: any) => {
      setCurrentUser(resp.username);
    });

    return () => {
      //console.log("Disconnecting ticket chat listener.");
      socket.off("sendChatsToClient");
      socket.off("chatKeys");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //connectSocket(currentUser);
    socket.emit("getMessages");
  }, [currentUser]);

  return (
    <>
      <Auth>
        {Object.values(routes).includes(location.pathname) &&
          location.pathname !== routes.login &&
          location.pathname !== routes.register && (
            <NavPage
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          )}

        <PrivateRoute
          //@ts-ignore
          path={routes.demonstratorNav}
          authLevel={"demonstrator"}
          //@ts-ignore
          component={DemonstratorNav}
          componentProps={{ demUnreadCounts }}
        />
        <ModalLabClosed
          setShowModal={setShowLabClosedModal}
          showModal={showLabClosedModal}
        />
        <ModalTicketResolved
          setShowModal={setShowTicketResolvedModal}
          showModal={showTicketResolvedModal}
        />

        <Switch>
          <Route exact path={routes.register} component={RegisterPage} />
          <Route
            exact
            path={routes.login}
            render={() => (
              <LoginPage
                setCurrentUser={setCurrentUser}
                setStudentPosition={setStudentPosition}
              />
            )}
          />

          {studentPosition === "form" && (
            <PrivateRoute
              //@ts-ignore
              exact
              path={routes.postTicket}
              authLevel={"studentOnly"}
              //@ts-ignore
              component={PostTicketPage}
            />
          )}
          {studentPosition === "queue" && (
            <PrivateRoute
              //@ts-ignore
              exact
              path={routes.postTicket}
              authLevel={"studentOnly"}
              //@ts-ignore
              component={TicketPostedPage}
              componentProps={{ currentUser }}
            />
          )}

          {studentPosition === "message" && (
            <PrivateRoute
              //@ts-ignore
              exact
              path={routes.postTicket}
              authLevel={"studentOnly"}
              //@ts-ignore
              component={StudentMessagePage}
              componentProps={{ currentUser }}
            />
          )}

          <PrivateRoute
            //@ts-ignore
            exact
            path={routes.helpDesk}
            authLevel={"demonstrator"}
            //@ts-ignore
            component={HelpDeskPage}
            componentProps={{ currentUser, setSelectedChat, chats }}
          />

          <PrivateRoute
            //@ts-ignore
            exact
            path={routes.activity}
            authLevel={"labLead"}
            //@ts-ignore
            component={Activity}
            componentProps={{}}
          />

          <PrivateRoute
            //@ts-ignore
            exact
            path={routes.summary}
            authLevel={"labLead"}
            //@ts-ignore
            component={SummaryDashboard}
            componentProps={{}}
          />

          <PrivateRoute
            //@ts-ignore
            exact
            path={routes.demonstratorMessages}
            authLevel={"demonstrator"}
            //@ts-ignore
            component={DemMessagePage}
            componentProps={{
              currentUser,
              demUnreadCounts,
              setDemUnreadCounts,
              readCounts,
              setReadCounts,
              chats: myChats,
              selectedChat,
              setSelectedChat,
            }}
          />

          <PrivateRoute
            //@ts-ignore
            path={routes.admin}
            authLevel={"labLead"}
            //@ts-ignore
            component={AdminPage}
          />
          <Redirect exact from="/labs" to="/labs/login" />
        </Switch>
      </Auth>
    </>
  );
});

export default App;
