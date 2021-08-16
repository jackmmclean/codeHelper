export function getTicketDates(cb: any) {
  fetch(`${process.env.REACT_APP_API}/stats/tickets/dates`, {
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

export function getTicketCount(cb: any, date: string, to: any) {
  fetch(
    `${process.env.REACT_APP_API}/stats/tickets/number/${encodeURIComponent(
      date
    )}/${encodeURIComponent(to)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

export function getStudentCount(cb: any, date: string, to: any) {
  fetch(
    `${process.env.REACT_APP_API}/stats/students/number/${encodeURIComponent(
      date
    )}/${encodeURIComponent(to)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

export function getAverageResolutionTime(cb: any, date: string, to: any) {
  fetch(
    `${
      process.env.REACT_APP_API
    }/stats/tickets/resolutionTime/${encodeURIComponent(
      date
    )}/${encodeURIComponent(to)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

export function getMissedCount(cb: any, date: string, to: any) {
  fetch(
    `${
      process.env.REACT_APP_API
    }/stats/tickets/missedCount/${encodeURIComponent(
      date
    )}/${encodeURIComponent(to)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

export function getModuleResolutionTimes(cb: any, date: string, to: any) {
  fetch(
    `${
      process.env.REACT_APP_API
    }/stats/modules/resolutionTimes/${encodeURIComponent(
      date
    )}/${encodeURIComponent(to)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

export function getDemonstratorResolutionTimes(cb: any, date: string, to: any) {
  fetch(
    `${
      process.env.REACT_APP_API
    }/stats/demonstrators/resolutionTimes/${encodeURIComponent(
      date
    )}/${encodeURIComponent(to)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

export function getStudentResolutionTimes(cb: any, date: string, to: any) {
  fetch(
    `${
      process.env.REACT_APP_API
    }/stats/students/resolutionTimes/${encodeURIComponent(
      date
    )}/${encodeURIComponent(to)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

export function getStudentTicketCounts(cb: any, date: string, to: any) {
  fetch(
    `${process.env.REACT_APP_API}/stats/students/tickets/${encodeURIComponent(
      date
    )}/${encodeURIComponent(to)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

export function getDemonstratorTicketCounts(cb: any, date: string, to: any) {
  fetch(
    `${
      process.env.REACT_APP_API
    }/stats/demonstrators/tickets/${encodeURIComponent(
      date
    )}/${encodeURIComponent(to)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

export function getResolutionTimeHistogramData(cb: any, date: string, to: any) {
  fetch(
    `${
      process.env.REACT_APP_API
    }/stats/tickets/resolutionTime/histogram/${encodeURIComponent(
      date
    )}/${encodeURIComponent(to)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

// export function getMissedProportion(cb: any, date: string, to: any) {
//   fetch(
//     `${
//       process.env.REACT_APP_API
//     }/stats/tickets/missedProportion/${encodeURIComponent(
//       date
//     )}/${encodeURIComponent(to)}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//     }
//   )
//     .then(async (res) => {
//       let responseBody = await res.json();
//       cb(responseBody);
//     })
//     .catch((er) => {
//       console.log(er);
//     });
// }

export function getLabActivity(cb: any, lab: any) {
  fetch(
    `${process.env.REACT_APP_API}/stats/lab/activity/${encodeURIComponent(
      lab
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}

export function getModuleActivity(cb: any, module: any) {
  fetch(
    `${process.env.REACT_APP_API}/stats/module/activity/${encodeURIComponent(
      module
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then(async (res) => {
      let responseBody = await res.json();
      cb(responseBody);
    })
    .catch((er) => {
      console.log(er);
    });
}
