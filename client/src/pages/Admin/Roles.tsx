import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { changeRole } from "../../api/users";
import { getUsers } from "../../api/users";

export default function RolePage() {
  const [users, setUsers] = useState([{ name: "", role: "", username: "" }]);

  const handleGetUsers = () =>
    getUsers(
      (responseBody: any) => {
        setUsers(responseBody.users);
        //console.log(responseBody.message);
      },
      (responseBody: any) => {
        console.log(responseBody.message);
      }
    );

  const handleChangeRole = (username: string, toRole: string) => {
    changeRole(
      username,
      toRole,
      (responseBody: any) => {},
      (responseBody: any) => {
        console.log(responseBody.message);
        if (responseBody.errno === 1451)
          alert(
            "Error changing role! Roles cannot be changed when users have associated tickets (including closed), labs or solutions."
          );
        setUsers([{ name: "", role: "", username: "" }]);
        handleGetUsers();
      }
    );
  };

  // function changeRole(username: string, toRole: string) {
  //   fetch("http://localhost:5000/users/changeRole", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //     body: JSON.stringify({
  //       username,
  //       toRole,
  //     }),
  //   }).then(async (res) => {
  //     if (!res.ok) {
  //       let responseBody = await res.json();
  //       console.log(responseBody.message);

  //       if (responseBody.errno === 1451) {
  //         alert(
  //           "Error changing role! Roles cannot be changed when users have associated tickets, labs or solutions."
  //         );
  //       }
  //       setUsers([{ name: "", role: "", username: "" }]);
  //       getUsers();
  //     } else {
  //       let responseBody = await res.json();
  //       console.log(responseBody.message);
  //     }
  //   });
  // }

  useEffect(() => {
    handleGetUsers();
  }, []);

  return (
    <Container>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.username}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={(e) =>
                    handleChangeRole(user.username, e.target.value)
                  }
                  defaultValue={user.role}
                  required
                >
                  {["student", "demonstrator", "labLead"].map((el) => (
                    <option key={el}>{el}</option>
                  ))}
                </Form.Control>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
