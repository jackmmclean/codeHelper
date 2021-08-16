import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { AuthContext } from "../../Auth";
import socket from "../../api/socket";
import routes from "../../Routes";

export default function LogoutButton({ setCurrentUser }: any) {
  const history = useHistory();

  //@ts-ignore
  const { logout } = useContext(AuthContext);

  const handleLogout = () =>
    logout((responseBody: any) => {
      //console.log(responseBody.message);
      socket.disconnect();
      history.push(routes.login);
      setCurrentUser("");
      window.location.reload();
    });

  return (
    <>
      <Button id={"logoutButton"} onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
}
