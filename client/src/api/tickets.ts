export function postTicket(
  moduleCode: any,
  practical: any,
  issueDescription: any,
  chosenTags: any,
  cbGood: any,
  cbBad: any
) {
  fetch(`${process.env.REACT_APP_API}/tickets/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      moduleCode,
      practical,
      issueDescription,
      chosenTags,
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

export function assignDemonstrator(ticketId: string, cb: any) {
  fetch(`${process.env.REACT_APP_API}/tickets/assignDemonstrator`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      ticketId: ticketId,
    }),
  }).then(async (res) => {
    const responseBody = await res.json();
    cb(responseBody);
  });
}

export function closeTicket(ticketID: string, cbGood: any, cbBad: any) {
  fetch(`${process.env.REACT_APP_API}/tickets/changeStatus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      id: ticketID,
      toStatus: "closed",
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

export function getDemonstratorChatKeys(
  demusername: string,
  cbGood: any,
  cbBad: any
) {
  fetch(`${process.env.REACT_APP_API}/chatKeys/get`, {
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

export function getTicketsByTag(tagName: string, cbGood: any, cbBad: any) {
  fetch(`${process.env.REACT_APP_API}/tickets/get/${encodeURIComponent(tagName)}`, {
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

export function getTicketsByStudent(
  studentUsername: string,
  cbGood: any,
  cbBad: any
) {
  fetch(`${process.env.REACT_APP_API}/tickets/get/user/${encodeURIComponent(studentUsername)}`, {
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

/////////////////////////////////
///////////// TAGS //////////////
/////////////////////////////////

export function getTags(cbGood: any, cbBad: any) {
  fetch(`${process.env.REACT_APP_API}/tags/get`, {
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

export function postTag(newTagName: string, cb: any) {
  fetch(`${process.env.REACT_APP_API}/tags/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: newTagName,
    }),
  })
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

//////////////////////////////////////
///////////// SOLUTIONS //////////////
//////////////////////////////////////

export function postSolution(
  solutionDescription: string,
  solutionTitle: string,
  cbGood: any,
  cbBad: any,
  ticketId = undefined
) {
  fetch(`${process.env.REACT_APP_API}/solutions/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      solutionDescription,
      solutionTitle,
      ticketId,
    }),
  })
    .then(async (res) => {
      let responseBody = await res.json();
      cbGood(responseBody);
    })
    .catch((er) => {
      cbBad(er);
    });
}

export function editSolution(solution: any, cb: any) {
  fetch(`${process.env.REACT_APP_API}/solutions/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ solution }),
  })
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

export function assignSolution(solutionId: string, ticketId: string, cb: any) {
  fetch(`${process.env.REACT_APP_API}/solutions/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      solutionId,
      ticketId,
    }),
  })
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

export function getSolutions(cb: any, ticketId = "all") {
  if (ticketId === "") {
    ticketId = "all";
  }
  fetch(`${process.env.REACT_APP_API}/solutions/get/${encodeURIComponent(ticketId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}
