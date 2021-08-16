export function getModules(cbGood: any, cbBad: any) {
  fetch(`${process.env.REACT_APP_API}/modules/get`, {
    method: "GET",
    credentials: "include",
  })
    .then(async (res) => {
      const responseBody = await res.json();
      if (!res.ok) {
        cbBad(responseBody);
      } else {
        cbGood(responseBody);
      }
    })
    .catch((e) => console.log(e));
}

export function insertModule(
  moduleCode: string,
  moduleName: string,
  labLeadUsername: string,
  cbGood: any,
  cbBad: any
) {
  fetch(`${process.env.REACT_APP_API}/modules/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      moduleCode,
      moduleName,
      labLeadUsername,
    }),
  })
    .then(async (res) => {
      let responseBody = await res.json();
      if (res.ok) {
        cbGood(responseBody);
      } else cbBad(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

export function deleteModule(moduleCode: string, cbGood: any, cbBad: any) {
  fetch(`${process.env.REACT_APP_API}/modules/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      moduleCode,
    }),
  })
    .then(async (res) => {
      let responseBody = await res.json();
      if (res.ok) {
        cbGood(responseBody);
      } else cbBad(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}
