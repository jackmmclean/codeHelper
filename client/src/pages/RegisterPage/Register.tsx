import React, { useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import FormInput from "../../components/FormInput";
import { AuthContext } from "../../Auth";
import routes from "../../Routes";

export default function Register() {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");

  const history = useHistory();
  //@ts-ignore
  const { register } = useContext(AuthContext);

  const handleRegister = () => {
    if (registerPassword !== registerPasswordConfirm) {
      alert("Passwords do not match.");
      return;
    }
    register(
      registerUsername,
      registerName,
      registerPassword,
      (responseBody: any) => {
        // console.log(responseBody.message);
        history.push(routes.login);
      },
      (responseBody: any) => {
        console.log(responseBody.message);
        alert(responseBody.message);
      }
    );
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-enter mb-4">Sign Up</h2>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <FormInput
              id={"username"}
              name={"Username"}
              type={"text"}
              handleChange={setRegisterUsername}
              minLength={3}
              maxLength={16}
            />
            <FormInput
              id={"name"}
              name={"Name"}
              type={"text"}
              handleChange={setRegisterName}
            />
            <FormInput
              id={"password"}
              name={"Password"}
              type={"password"}
              handleChange={setRegisterPassword}
              minLength={6}
              maxLength={60}
            />
            <FormInput
              id={"password-confirm"}
              name={"Password Confirmation"}
              type={"password"}
              handleChange={setRegisterPasswordConfirm}
              minLength={6}
              maxLength={60}
            />
            <Button className="w-100 mt-2" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="./login">Login</Link>
      </div>
    </>
  );
}
