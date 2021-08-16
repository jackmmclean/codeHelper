export function getLabs(cbGood: any, cbBad: any) {
  fetch(`${process.env.REACT_APP_API}/cslabs/get`, {
    method: "GET",
    credentials: "include",
  })
    .then(async (res) => {
      const responseBody = await res.json();
      if (!res.ok) {
        cbBad(responseBody);
        console.log(res);
      } else {
        cbGood(responseBody);
      }
    })
    .catch((e) => console.log(e));
}

export function insertLab(labTitle: string, cbGood: any, cbBad: any) {
  fetch(`${process.env.REACT_APP_API}/cslabs/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      labTitle,
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

export function deleteLab(labId: string, cbGood: any, cbBad: any) {
  fetch(`${process.env.REACT_APP_API}/cslabs/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      labId,
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

export function openLab(labId: string, cbGood: any, cbBad: any) {
  fetch(`${process.env.REACT_APP_API}/cslabs/open`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      labId,
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

export function closeLab(labId: string, cbGood: any, cbBad: any) {
  fetch(`${process.env.REACT_APP_API}/cslabs/close`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      labId,
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
