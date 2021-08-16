export function changeRole(
  username: string,
  toRole: string,
  cbGood: any,
  cbBad: any
) {
  fetch(`${process.env.REACT_APP_API}/users/changeRole`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      username,
      toRole,
    }),
  })
    .then(async (res) => {
      let responseBody = await res.json();
      if (!res.ok) {
        cbBad(responseBody);
      } else {
        cbGood(responseBody);
      }
    })
    .catch((e) => console.log(e));
}

export function getUsers(cbGood: any, cbBad: any) {
  fetch(`${process.env.REACT_APP_API}/users/get`, {
    method: "GET",
    credentials: "include",
  })
    .then(async (res) => {
      const responseBody = await res.json();
      cbGood(responseBody);
    })
    .catch((err) => cbBad(err));
}

export function getActivity(cbGood: any, cbBad: any) {
  fetch(`${process.env.REACT_APP_API}/activity/get`, {
    method: "GET",
    credentials: "include",
  })
    .then(async (res) => {
      const responseBody = await res.json();
      cbGood(responseBody);
    })
    .catch((err) => cbBad(err));
}
