import React, { useState, useContext, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import FormInput from "../../components/FormInput";
import { AuthContext } from "../../Auth";
import routes from "../../Routes";

export default function Login({ setCurrentUser, setStudentPosition }: any) {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const history = useHistory();
  //@ts-ignore
  const { login, isAStudent, isAuthenticated } = useContext(AuthContext);

  const handleLogin = () =>
    login(
      loginUsername,
      loginPassword,
      (responseBody: any) => {
        //console.log(responseBody.message);
        setCurrentUser(responseBody.user);
        if (responseBody.hasOwnProperty("position")) {
          setStudentPosition(responseBody.position);
        }
      },
      (responseBody: any) => {
        console.log(responseBody.message);
        alert(responseBody.message);
      }
    );

  useEffect(() => {
    if (isAuthenticated) {
      const redirectLocation = isAStudent ? routes.postTicket : routes.helpDesk;
      history.push(redirectLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-enter mb-4">Login</h2>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <FormInput
              id={"username"}
              name={"Username"}
              type={"text"}
              handleChange={setLoginUsername}
            />
            <FormInput
              id={"password"}
              name={"Password"}
              type={"password"}
              handleChange={setLoginPassword}
            />
            <Button className="w-100 mt-2" type="submit">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Don't have an account? <Link to="./register">Register</Link>
      </div>
    </>
  );
}
