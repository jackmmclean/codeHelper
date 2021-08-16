import socket from "../api/socket";

export function register(
  registerUsername: string,
  registerName: string,
  registerPassword: string,
  cbGood: any,
  cbBad: any
) {
  fetch(`${process.env.REACT_APP_API}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: registerUsername,
      name: registerName,
      password: registerPassword,
    }),
  }).then(async (res) => {
    let responseBody = await res.json();
    if (!res.ok) {
      cbBad(responseBody);
    } else {
      cbGood(responseBody);
    }
  });
}

export function login(
  loginUsername: string,
  loginPassword: string,
  cbGood: any,
  cbBad: any
) {
  fetch(`${process.env.REACT_APP_API}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      username: loginUsername,
      password: loginPassword,
    }),
  })
    .then(async (res) => {
      let responseBody = await res.json();
      if (!res.ok) {
        cbBad(responseBody);
      } else {
		  		socket.connect();
        cbGood(responseBody);
        //connectSocket(loginUsername);
      }
    })
    .catch((er) => console.log(er));
}

export function logout(cb: any) {
  fetch(`${process.env.REACT_APP_API}/users/logout`, {
    method: "POST",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) {
        console.log(res);
        alert("Logout failed.");
      } else {
        socket.disconnect();
        let responseBody = await res.json();
        cb(responseBody);
      }
    })
    .catch((er) => console.log(er));
}

export function getUsername(cb: any) {
  fetch(`${process.env.REACT_APP_API}/users/getUsername`, {
    method: "GET",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) {
        console.log(res);
      } else {
        let responseBody = await res.json();
        cb(responseBody);
      }
    })
    .catch((er) => console.log(er));
}

export function hasDemonstratorAuth() {
  return fetch(`${process.env.REACT_APP_API}/users/getRole`, {
    method: "GET",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) {
        console.log(res);
      } else {
        let responseBody = await res.json();
        return (
          responseBody.role === "demonstrator" ||
          responseBody.role === "labLead"
        );
      }
    })
    .catch((er) => {
      console.log(er);
      throw er;
    });
}

export function hasLabLeadAuth() {
  return fetch(`${process.env.REACT_APP_API}/users/getRole`, {
    method: "GET",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) {
        console.log(res);
      } else {
        let responseBody = await res.json();
        return responseBody.role === "labLead";
      }
    })
    .catch((er) => {
      console.log(er);
      throw er;
    });
}

export function isStudent() {
  return fetch(`${process.env.REACT_APP_API}/users/getRole`, {
    method: "GET",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) {
        console.log(res);
      } else {
        let responseBody = await res.json();
        return responseBody.role === "student";
      }
    })
    .catch((er) => {
      console.log(er);
      throw er;
    });
}

export function isLoggedIn() {
  return fetch(`${process.env.REACT_APP_API}/users/getRole`, {
    method: "GET",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) {
        console.log(res);
      } else {
        let responseBody = await res.json();
		if(["student", "demonstrator", "labLead"].includes(
			responseBody.role
		  )){socket.connect()}
        return ["student", "demonstrator", "labLead"].includes(
          responseBody.role
        );
      }
    })
    .catch((er) => {
      console.log(er);
      throw er;
    });
}

// export function connectSocket(username: string) {
//   //socket.auth = { username: username };
//   socket.connect();
// }
