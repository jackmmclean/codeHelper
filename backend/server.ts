import { sortTicketsByAge, updateMissedStudentsPosition } from "./utils";

export {};

require("dotenv").config();

const express = require("express"), // need for express app
  http = require("http"),
  bodyParser = require("body-parser"), // need to process request body for data
  cors = require("cors"), // need to allow local dev
  session = require("express-session"), // need for sessions
  bcrypt = require("bcrypt"), // need for encryption
  passport = require("passport"), // need for auth
  cookieParser = require("cookie-parser"),
  siofu = require("socketio-file-upload"),
  path = require("path"),
  mime = require("mime"),
  fs = require("fs"),
  favicon = require("serve-favicon");
//expressPeerServer = require("peer").ExpressPeerServer;

// import functions from other modules
const {
  insertStudent,
  findOneUser,
  insertTicket,
  insertTag,
  insertSolution,
  updateSolution,
  assignTicketSolution,
  getAllLiveTickets,
  getAllTags,
  getAllUsers,
  getAllModules,
  changeTicketStatus,
  changeTicketDemonstrator,
  changeRole,
  sessionStore,
  getSolutions,
  deleteModule,
  insertModule,
  insertLab,
  getAllLabs,
  deleteLab,
  changeLabStatus,
  labIsClosed,
  markAllLiveTicketsAsMissed,
  getTicketsByTag,
  getTicketsByStudent,
  getActivity,
  getAllTickets,
} = require("./dao.ts");
const {
  updateStudentsOnQueuePosition,
  getDemonstratorChatKeys,
  getStudentPosition,
  getTicketCount,
  getTicketDates,
  getAverageResolutionTime,
  getMissedCount,
  getModuleResolutionTimes,
  getStudentResolutionTimes,
  getStudentTicketCount,
  getDemonstratorTicketCount,
  getLabActivity,
  getDemonstratorResolutionTimes,
  getResolutionTimeHistogramData,
  getStudentCount,
  getModuleActivity,
} = require("./utils");
const { Ticket, Solution, Lab } = require("./classes");

const mySession = session({
  key: process.env.COOKIE_NAME,
  secret: process.env.SESSION_SECRET,
  resave: true,
  store: sessionStore,
  saveUninitialized: true,
  cookie: { secure: false },
});
const corsOptions = {
  origin: process.env.REACT_APP_CORS,
  optionsSuccessStatus: 200, // needed for some legacy browsers (IE11, various SmartTVs) that couldnt handle 204
  credentials: true,
};
const initialisePassport = require("./passport-config");
initialisePassport(passport, (username) => findOneUser(username));

const app = express();

const server = http.Server(app);

app
  .use(cors(corsOptions))
  .use(bodyParser.json())
  .use(cookieParser(process.env.COOKIE_NAME))
  .use(express.urlencoded({ extended: false }))
  .use(mySession)
  .use(passport.initialize())
  .use(passport.session())
  .use(siofu.router)
  .use(favicon(__dirname + "/favicon.ico"));
//.use("/peerjs", expressPeerServer(server, { debug: true }));

const { ioInit } = require("./serverSocket");
const io = ioInit(server, passport, sessionStore);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({
      message: `Please log in to continue!`,
    });
    return;
  }
}

function ensureDemPrivileges(req, res, next) {
  if (["demonstrator", "labLead"].includes(req.user.role)) {
    return next();
  } else {
    res.status(401).json({
      message: `Students are not authorised for this request.`,
    });
    return;
  }
}

function ensureLeadPrivileges(req, res, next) {
  if (req.user.role === "labLead") {
    return next();
  } else {
    res.status(401).json({
      message: `Only lab leads are authorised for this request.`,
    });
    return;
  }
}

app.post("/users/login", function (req, res, next) {
  passport.authenticate("local", { session: true }, function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401).json({
        message: `Invalid login credentials. If you cannot remember your login details, please contact the lab lead.`,
        user: null,
        role: null,
      });
      return next(err);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      if (req.user.role === "student") {
        getAllLiveTickets()
          .then((tickets) => {
            return res.status(200).json({
              message: `Logged in '${req.body.username}'.`,
              user: req.body.username,
              role: req.user.role,
              position: getStudentPosition(
                tickets.find(
                  (ticket) => ticket.studentUsername === req.body.username
                )
              ),
            });
          })
          .catch((e) => console.log(e));
      } else {
        return res.status(200).json({
          message: `Logged in '${req.body.username}'.`,
          user: req.body.username,
          role: req.user.role,
          //position: getStudentPosition(),
        });
      }
    });
  })(req, res, next);
});

// Logout route
app.post("/users/logout", function (req, res) {
  const username = req._passport.session.user;
  try {
    req.logout();
    console.log(`'${username}' logged out.`);
    res.status(200).json({ message: `Logged out '${username}'.` });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: `Failed to log out '${username}'.` });
  }
});

// Route to get username from server
app.get("/users/getUsername", function (req, res) {
  const username = req._passport.session && req._passport.session.user;
  res.status(200).json({ username });
});

// Route to get role from server
app.get("/users/getRole", function (req, res) {
  const role = req.user ? req.user.role : null;
  res.status(200).json({ role });
});

// Register route
app.post("/users/register", async (req: any, res: any) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const existingUser = await findOneUser(req.body.username);

    if (existingUser !== undefined) {
      res.status(409).json({
        message: `The username ${req.body.username} is already taken!`,
      });
      return;
    }

    let insertAttempt = await insertStudent({
      username: req.body.username,
      name: req.body.name,
      password: hashedPassword,
    });

    if (insertAttempt.errno !== undefined) {
      console.log(insertAttempt);
      res.status(409).json({
        message: `The user could not be registered. Error number ${insertAttempt.errno}.`,
      });
    } else {
      res.status(201).json({
        message: `Successfully registered ${req.body.username}`,
        user: req.body.username,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

// Route to get all users from the database
app.get(
  "/users/get",
  ensureAuthenticated,
  ensureDemPrivileges,
  async function (req, res) {
    const usersAttempt = await getAllUsers();

    if (usersAttempt.errno !== undefined) {
      console.log(usersAttempt);
      res.status(409).json({
        message: `Could not get users. Error number ${usersAttempt.errno}.`,
        users: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got all ${usersAttempt.length} users.`,
        users: usersAttempt,
      });
    }
  }
);

// Route to post a ticket
app.post("/tickets/post", ensureAuthenticated, async function (req, res) {
  const issueDescription = req.body.issueDescription;
  const moduleCode = req.body.moduleCode;
  const studentUsername = req._passport.session.user;
  const practical = req.body.practical;
  const tags = req.body.chosenTags;

  const modules = await getAllModules();

  if (!modules.map((module) => module.code).includes(moduleCode)) {
    res.status(409).json({
      message: `The ticket could not be posted. Invalid module code!`,
    });
    return;
  }

  if (!["1", "2"].includes(moduleCode[2])) {
    res.status(409).json({
      message: `This application only currently handles the assignment of tickets to labs for first and second year modules.`,
    });
    return;
  }

  const labId =
    moduleCode[2] === "1"
      ? "Labfd7753-e52a-49c9-bb80-8d7fd806959d"
      : "Labfd7753-e52a-49c9-bb80-8d7fd8123456";

  let labIsClosedAttempt = await labIsClosed(labId);

  if (labIsClosedAttempt.errno !== undefined) {
    console.log(labIsClosedAttempt);
    res.status(409).json({
      message: `Could not determine if lab is open. Error number ${labIsClosedAttempt.errno}.`,
    });
    return;
  } else if (labIsClosedAttempt === true) {
    res.status(409).json({
      message: `Could not post ticket, lab is closed!`,
    });
    return;
  }

  const createdTicket = new Ticket(
    issueDescription,
    moduleCode,
    studentUsername,
    practical,
    labId,
    tags
  );

  const allLiveTickets = await getAllLiveTickets();
  const studentHasALiveTicket =
    allLiveTickets.filter(
      (ticket) => ticket.studentUsername === studentUsername
    ).length !== 0;

  if (studentHasALiveTicket) {
    res.status(409).json({
      message: `The ticket could not be posted. You already have a live ticket!`,
    });
    return;
  }

  let insertTicketAttempt = await insertTicket(createdTicket.toJSON());

  if (insertTicketAttempt.errno !== undefined) {
    console.log(insertTicketAttempt);
    res.status(409).json({
      message: `The ticket could not be posted. Error number ${insertTicketAttempt.errno}.`,
      ticket: createdTicket.toJSON(),
    });
  } else {
    const liveTickets = await getAllLiveTickets();
    const ticket = liveTickets.find((ticket) => ticket.id === createdTicket.id);

    io.to(ticket.studentUsername).emit(
      "studentPosition",
      getStudentPosition(ticket)
    );
    updateStudentsOnQueuePosition(io, liveTickets);
    io.emit("sendTicketsToClients", liveTickets);
    res.status(200).json({
      message: `Ticket with ID ${createdTicket.id} successfully created.`,
      ticket: createdTicket.toJSON(),
    });
  }
});

app.get(
  "/tickets/get/:tagName",
  ensureAuthenticated,
  ensureDemPrivileges,
  async function (req, res) {
    const tagName = decodeURIComponent(req.params.tagName);

    const ticketsAttempt = await getTicketsByTag(tagName);

    if (ticketsAttempt.errno !== undefined) {
      console.log(ticketsAttempt);
      res.status(409).json({
        message: `Could not get tickets. Error number ${ticketsAttempt.errno}.`,
        tickets: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got all ${ticketsAttempt.length} tickets associated with the tag '${tagName}'.`,
        tickets: ticketsAttempt,
      });
    }
  }
);

app.get(
  "/tickets/get/user/:studentUsername",
  ensureAuthenticated,
  ensureDemPrivileges,
  async function (req, res) {
    const studentUsername = decodeURIComponent(req.params.studentUsername);

    const ticketsAttempt = await getTicketsByStudent(studentUsername);

    if (ticketsAttempt.errno !== undefined) {
      console.log(ticketsAttempt);
      res.status(409).json({
        message: `Could not get tickets. Error number ${ticketsAttempt.errno}.`,
        tickets: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got all ${ticketsAttempt.length} tickets associated with the student '${studentUsername}'.`,
        tickets: sortTicketsByAge(ticketsAttempt).reverse(),
      });
    }
  }
);

// Route to change ticket status
app.post(
  "/tickets/changeStatus",
  ensureAuthenticated,
  async function (req, res) {
    const toStatus = req.body.toStatus;
    var id = req.body.id;
    var ticket;

    const tickets = await getAllLiveTickets();
    if (req.user.role === "student") {
      ticket = tickets.find(
        (ticket) => ticket.studentUsername === req.user.username
      );
    } else if (id.length < 17) {
      ticket = tickets.find((ticket) => ticket.studentUsername === id);
    } else {
      ticket = tickets.find((ticket) => ticket.id === id);
    }

    if (!["new", "missed", "inProgress", "closed"].includes(toStatus)) {
      res.status(409).json({
        message: `'${toStatus}' is not a valid status.`,
      });
      return;
    }

    //if the ticket has no assigned demonstrator, the demonstrator closing the ticket shall be assigned
    if (!ticket.demonstratorUsername) {
      const demonstrator = req._passport.session.user;
      const changeAttempt = await changeTicketDemonstrator(
        ticket.id,
        demonstrator
      );
      if (changeAttempt.errno !== undefined) {
        console.log(changeAttempt);
        res.status(409).json({
          message: `This ticket had no assigned demonstrator when you tried to close it. Could not change ticket demonstrator. Error number ${changeAttempt.errno}.`,
        });
      }
    }

    const changeAttempt = await changeTicketStatus(ticket.id, toStatus);
    if (changeAttempt.errno !== undefined) {
      console.log(changeAttempt);
      res.status(409).json({
        message: `Could not change ticket status. Error number ${changeAttempt.errno}.`,
      });
    } else {
      const liveTickets = await getAllLiveTickets();
      updateStudentsOnQueuePosition(io, liveTickets);
      //send tickets to demonstrators
      io.emit("sendTicketsToClients", liveTickets);

      io.to("demonstratorChat").emit(
        "chatKeys",
        await getDemonstratorChatKeys(liveTickets)
      );

      io.to(ticket.studentUsername).emit(
        "studentPosition",
        getStudentPosition(toStatus)
      );

      io.to(ticket.studentUsername).emit("ticketHasBeenResolved");

      res.status(200).json({
        message: `Successfully changed ticket status to '${toStatus}'.`,
      });
    }
  }
);

// Route to assign demonstrator
app.post(
  "/tickets/assignDemonstrator",
  ensureAuthenticated,
  ensureDemPrivileges,
  async function (req, res) {
    const demonstrator = req._passport.session.user;
    const ticketId = req.body.ticketId;
    const changeAttempt = await changeTicketDemonstrator(
      ticketId,
      demonstrator
    );
    if (changeAttempt.errno !== undefined) {
      console.log(changeAttempt);
      res.status(409).json({
        message: `Could not change ticket demonstrator. Error number ${changeAttempt.errno}.`,
      });
    } else {
      const changeAttempt = await changeTicketStatus(ticketId, "inProgress");
      if (changeAttempt.errno !== undefined) {
        console.log(changeAttempt);
        res.status(409).json({
          message: `Could not change ticket status. Error number ${changeAttempt.errno}.`,
        });
      } else {
        const liveTickets = await getAllLiveTickets();
        updateStudentsOnQueuePosition(io, liveTickets);

        const ticket = liveTickets.find((ticket) => ticket.id === ticketId);

        io.to(ticket.studentUsername).emit(
          "studentPosition",
          getStudentPosition(ticket)
        );

        io.emit("sendTicketsToClients", liveTickets);

        io.to("demonstratorChat").emit(
          "chatKeys",
          await getDemonstratorChatKeys(liveTickets)
        );

        res.status(200).json({
          message: `Successfully changed ticket demonstrator to '${demonstrator}' and updated status to 'in Progress'.`,
        });
      }
    }
  }
);

// Route to get all modules from the database
app.get("/modules/get", ensureAuthenticated, async function (req, res) {
  const modulesAttempt = await getAllModules();

  if (modulesAttempt.errno !== undefined) {
    console.log(modulesAttempt);
    res.status(409).json({
      message: `Could not get modules. Error number ${modulesAttempt.errno}.`,
      modules: null,
    });
  } else {
    res.status(200).json({
      message: `Successfully got all ${modulesAttempt.length} modules.`,
      modules: modulesAttempt,
    });
  }
});

// Route to post a module to the database
app.post(
  "/modules/post",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const { moduleCode, moduleName, labLeadUsername } = req.body;

    const moduleAttempt = await insertModule(
      moduleCode,
      moduleName,
      labLeadUsername
    );

    if (moduleAttempt.errno !== undefined) {
      console.log(moduleAttempt);
      res.status(409).json({
        message: `Could not post module. Error number ${moduleAttempt.errno}.`,
      });
    } else {
      res.status(201).json({
        message: `Successfully posted module with code '${moduleCode}'.`,
      });
    }
  }
);

// Route to delete a module
app.post(
  "/modules/delete",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const moduleCode = req.body.moduleCode;

    const deleteAttempt = await deleteModule(moduleCode);

    if (deleteAttempt.errno !== undefined) {
      console.log(deleteAttempt);
      res.status(409).json({
        message: `Could not delete module. Error number ${deleteAttempt.errno}.`,
      });
    } else {
      res.status(200).json({
        message: `Successfully deleted module '${moduleCode}'.`,
      });
    }
  }
);

// Route to get all labs from the database
app.get(
  "/cslabs/get",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const labsAttempt = await getAllLabs();

    if (labsAttempt.errno !== undefined) {
      console.log(labsAttempt);
      res.status(409).json({
        message: `Could not get labs. Error number ${labsAttempt.errno}.`,
        modules: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got all ${labsAttempt.length} labs.`,
        labs: labsAttempt,
      });
    }
  }
);

// Route to post a lab to the database
app.post(
  "/cslabs/post",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const labTitle = req.body.labTitle;

    const newLab = new Lab(labTitle);

    const labAttempt = await insertLab(newLab);

    if (labAttempt.errno !== undefined) {
      console.log(labAttempt);
      res.status(409).json({
        message: `Could not post lab. Error number ${labAttempt.errno}.`,
      });
    } else {
      res.status(201).json({
        message: `Successfully posted lab with id '${newLab.id}'.`,
      });
    }
  }
);

// Route to delete a lab
app.post(
  "/cslabs/delete",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const labId = req.body.labId;

    const deleteAttempt = await deleteLab(labId);

    if (deleteAttempt.errno !== undefined) {
      console.log(deleteAttempt);
      res.status(409).json({
        message: `Could not delete lab. Error number ${deleteAttempt.errno}.`,
      });
    } else {
      res.status(200).json({
        message: `Successfully deleted lab with id '${labId}'.`,
      });
    }
  }
);

// Route to open a lab
app.post(
  "/cslabs/open",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const labId = req.body.labId;

    const openAttempt = await changeLabStatus("open", labId);

    if (openAttempt.errno !== undefined) {
      console.log(openAttempt);
      res.status(409).json({
        message: `Could not open lab. Error number ${openAttempt.errno}.`,
      });
    } else {
      res.status(200).json({
        message: `Successfully changed status of lab with id '${labId}' to 'open'.`,
      });
    }
  }
);

// Route to close a lab
app.post(
  "/cslabs/close",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const labId = req.body.labId;

    const closeAttempt = await changeLabStatus("closed", labId);

    if (closeAttempt.errno !== undefined) {
      console.log(closeAttempt);
      res.status(409).json({
        message: `Could not close lab. Error number ${closeAttempt.errno}.`,
      });
    } else {
      updateMissedStudentsPosition(await getAllLiveTickets(), io);
      const markAsMissedAttempt = await markAllLiveTicketsAsMissed(labId);
      if (markAsMissedAttempt.errno !== undefined) {
        console.log(markAsMissedAttempt);
        res.status(409).json({
          message: `An error occured whilst attempting to set all live tickets as 'missed'. Error number ${markAsMissedAttempt.errno}.`,
        });
      } else {
        res.status(200).json({
          message: `Successfully changed status of lab with id '${labId}' to 'closed'. ${markAsMissedAttempt.changedRows} tickets were marked as missed.`,
        });
      }
    }
  }
);

// Route to get all tags from the database
app.get("/tags/get", ensureAuthenticated, async function (req, res) {
  const tagsAttempt = await getAllTags();

  if (tagsAttempt.errno !== undefined) {
    console.log(tagsAttempt);
    res.status(409).json({
      message: `Could not get tags. Error number ${tagsAttempt.errno}.`,
      tags: null,
    });
  } else {
    res.status(200).json({
      message: `Successfully got all ${tagsAttempt.length} tags.`,
      tags: tagsAttempt,
    });
  }
});

// Route to post a tag to the database
app.post("/tags/post", ensureAuthenticated, async function (req, res) {
  const tagName = req.body.name;
  const tagAttempt = await insertTag(tagName);

  if (tagAttempt.errno !== undefined) {
    console.log(tagAttempt);
    res.status(409).json({
      message: `Could not post tag. Error number ${tagAttempt.errno}.`,
      tag: null,
    });
  } else {
    res.status(201).json({
      message: `Successfully posted tag '${tagName}'.`,
      tag: { name: tagName },
    });
  }
});

// Route to change user role
app.post(
  "/users/changeRole",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const { username, toRole } = req.body;
    if (!["student", "demonstrator", "labLead"].includes(toRole)) {
      res.status(409).json({
        message: `'${toRole}' is not a valid role.`,
      });
      return;
    }

    const changeAttempt = await changeRole(username, toRole);
    if (changeAttempt.errno !== undefined) {
      console.log(changeAttempt);
      res.status(409).json({
        message: `Could not change user role. Error number ${changeAttempt.errno}.`,
        errno: changeAttempt.errno,
      });
    } else {
      res.status(200).json({
        message: `Successfully changed the role of '${username}' to '${toRole}'.`,
      });
    }
  }
);

app.get("/download/:fileName", ensureAuthenticated, function (req, res) {
  var filePath = `${__dirname}/chatFiles/${req.params.fileName}`;

  var filename = path.basename(filePath);
  var mimetype = mime.lookup(filePath);

  res.set("Content-disposition", "attachment; filename=" + filename);
  res.set("Content-type", mimetype);

  var filestream = fs.createReadStream(filePath);
  filestream.pipe(res);
});

// Route to post a solution to the database
app.post(
  "/solutions/post",
  ensureAuthenticated,
  ensureDemPrivileges,
  async function (req, res) {
    const solutionDescription = req.body.solutionDescription;
    const solutionTitle = req.body.solutionTitle;
    const ticketId = req.body.ticketId;
    const solution = new Solution(
      solutionDescription,
      solutionTitle,
      req._passport.session.user
    );
    const solutionAttempt = await insertSolution(solution);

    if (solutionAttempt.errno !== undefined) {
      console.log(solutionAttempt);
      res.status(409).json({
        message: `Could not post solution. Error number ${solutionAttempt.errno}.`,
      });
      return;
    }

    if (ticketId !== undefined) {
      const assignSolutionAttempt = await assignTicketSolution(
        ticketId,
        solution.id
      );
      if (assignSolutionAttempt.errno !== undefined) {
        console.log(assignSolutionAttempt);
        res.status(409).json({
          message: `Could not assign solution. Error number ${assignSolutionAttempt.errno}.`,
        });
        return;
      }
    }

    res.status(201).json({
      message: `Successfully posted solution with id '${solution.id}'${
        ticketId !== undefined
          ? `, assigned to ticket with id '${ticketId}'`
          : ""
      }.`,
      solutionId: solution.id,
    });
  }
);

// Route to post a solution to the database
app.post(
  "/solutions/edit",
  ensureAuthenticated,
  ensureDemPrivileges,
  async function (req, res) {
    var solution = req.body.solution;
    const { solutionDescription, solutionTitle, id, creation_timestamp } =
      solution;

    solution = new Solution(
      solutionDescription,
      solutionTitle,
      req._passport.session.user,
      id,
      creation_timestamp
    );
    const updateSolutionAttempt = await updateSolution(solution);

    if (updateSolutionAttempt.errno !== undefined) {
      console.log(updateSolutionAttempt);
      res.status(409).json({
        message: `Could not edit solution. Error number ${updateSolutionAttempt.errno}.`,
      });
      return;
    }

    res.status(201).json({
      message: `Successfully edited solution with id '${id}'.`,
    });
  }
);

// Route to assign a solution to a ticket
app.post(
  "/solutions/assign",
  ensureAuthenticated,
  ensureDemPrivileges,
  async function (req, res) {
    const solutionId = req.body.solutionId;
    const ticketId = req.body.ticketId;

    const assignSolutionAttempt = await assignTicketSolution(
      ticketId,
      solutionId
    );
    if (assignSolutionAttempt.errno !== undefined) {
      console.log(assignSolutionAttempt);
      res.status(409).json({
        message: `Could not assign solution. Error number ${assignSolutionAttempt.errno}.`,
      });
      return;
    }

    res.status(200).json({
      message: `Successfully assigned solution with id '${solutionId}' to ticket with id '${ticketId}'`,
      solutionId,
    });
  }
);

// Route to get the solution for a ticket
app.get(
  "/solutions/get/:ticketId",

  async function (req, res) {
    const ticketId = decodeURIComponent(req.params.ticketId);
    const getSolutionAttempt = await getSolutions(ticketId);

    if (getSolutionAttempt.errno !== undefined) {
      console.log(getSolutionAttempt);
      res.status(409).json({
        message: `Could not get solution. Error number ${getSolutionAttempt.errno}.`,
        solutions: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got all ${getSolutionAttempt.length} solutions.`,
        solutions: getSolutionAttempt,
      });
    }
  }
);

app.get(
  "/activity/get/",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const activityAttempt = await getActivity();

    if (activityAttempt.errno !== undefined) {
      console.log(activityAttempt);
      res.status(409).json({
        message: `Could not get activities. Error number ${activityAttempt.errno}.`,
        activities: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got all ${activityAttempt.length} activities.`,
        activities: activityAttempt,
      });
    }
  }
);

app.get(
  "/stats/tickets/dates",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const ticketAttempt = await getAllTickets();

    if (ticketAttempt.errno !== undefined) {
      console.log(ticketAttempt);
      res.status(409).json({
        message: `Could not get all tickets. Error number ${ticketAttempt.errno}.`,
        dates: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got ticket dates.`,
        dates: getTicketDates(ticketAttempt),
      });
    }
  }
);

app.get(
  "/stats/tickets/number/:date/:to",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const date = decodeURIComponent(req.params.date);
    const to = decodeURIComponent(req.params.to);

    const ticketAttempt = await getAllTickets();

    if (ticketAttempt.errno !== undefined) {
      console.log(ticketAttempt);
      res.status(409).json({
        message: `Could not get all tickets. Error number ${ticketAttempt.errno}.`,
        count: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got ticket count for date '${date}'${
          to && ` to '${to}'`
        }.`,
        count: getTicketCount(ticketAttempt, date, to),
      });
    }
  }
);

app.get(
  "/stats/students/number/:date/:to",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const date = decodeURIComponent(req.params.date);
    const to = decodeURIComponent(req.params.to);

    const ticketAttempt = await getAllTickets();

    if (ticketAttempt.errno !== undefined) {
      console.log(ticketAttempt);
      res.status(409).json({
        message: `Could not get all tickets. Error number ${ticketAttempt.errno}.`,
        count: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got student count for date '${date}'${
          to && ` to '${to}'`
        }.`,
        count: getStudentCount(ticketAttempt, date, to),
      });
    }
  }
);

app.get(
  "/stats/tickets/resolutionTime/:date/:to",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const date = decodeURIComponent(req.params.date);
    const to = decodeURIComponent(req.params.to);

    const ticketAttempt = await getAllTickets();

    if (ticketAttempt.errno !== undefined) {
      console.log(ticketAttempt);
      res.status(409).json({
        message: `Could not get all tickets. Error number ${ticketAttempt.errno}.`,
        time: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got average resolution time for date '${date}'${
          to && ` to '${to}'`
        }.`,
        time: getAverageResolutionTime(ticketAttempt, date, to),
      });
    }
  }
);

app.get(
  "/stats/tickets/missedCount/:date/:to",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const date = decodeURIComponent(req.params.date);
    const to = decodeURIComponent(req.params.to);

    const ticketAttempt = await getAllTickets();

    if (ticketAttempt.errno !== undefined) {
      console.log(ticketAttempt);
      res.status(409).json({
        message: `Could not get all tickets. Error number ${ticketAttempt.errno}.`,
        count: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got average resolution time for date '${date}'${
          to && ` to '${to}'`
        }.`,
        count: getMissedCount(ticketAttempt, date, to),
      });
    }
  }
);

app.get(
  "/stats/modules/resolutionTimes/:date/:to",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const date = decodeURIComponent(req.params.date);
    const to = decodeURIComponent(req.params.to);

    const ticketAttempt = await getAllTickets();

    if (ticketAttempt.errno !== undefined) {
      console.log(ticketAttempt);
      res.status(409).json({
        message: `Could not get all tickets. Error number ${ticketAttempt.errno}.`,
        times: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got average resolution time for each module for date '${date}'${
          to && ` to '${to}'`
        }.`,
        times: getModuleResolutionTimes(ticketAttempt, date, to),
      });
    }
  }
);

app.get(
  "/stats/demonstrators/resolutionTimes/:date/:to",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const date = decodeURIComponent(req.params.date);
    const to = decodeURIComponent(req.params.to);

    const ticketAttempt = await getAllTickets();

    if (ticketAttempt.errno !== undefined) {
      console.log(ticketAttempt);
      res.status(409).json({
        message: `Could not get all tickets. Error number ${ticketAttempt.errno}.`,
        times: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got average resolution time for each module for date '${date}'${
          to && ` to '${to}'`
        }.`,
        times: getDemonstratorResolutionTimes(ticketAttempt, date, to),
      });
    }
  }
);

app.get(
  "/stats/students/resolutionTimes/:date/:to",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const date = decodeURIComponent(req.params.date);
    const to = decodeURIComponent(req.params.to);

    const ticketAttempt = await getAllTickets();

    if (ticketAttempt.errno !== undefined) {
      console.log(ticketAttempt);
      res.status(409).json({
        message: `Could not get all tickets. Error number ${ticketAttempt.errno}.`,
        times: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got average resolution time for each student for date '${date}'${
          to && ` to '${to}'`
        }.`,
        times: getStudentResolutionTimes(ticketAttempt, date, to),
      });
    }
  }
);

app.get(
  "/stats/demonstrators/tickets/:date/:to",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const date = decodeURIComponent(req.params.date);
    const to = decodeURIComponent(req.params.to);

    const ticketAttempt = await getAllTickets();

    if (ticketAttempt.errno !== undefined) {
      console.log(ticketAttempt);
      res.status(409).json({
        message: `Could not get all tickets. Error number ${ticketAttempt.errno}.`,
        counts: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got ticket closed count for each demonstrator for date '${date}'${
          to && ` to '${to}'`
        }.`,
        counts: getDemonstratorTicketCount(ticketAttempt, date, to),
      });
    }
  }
);

app.get(
  "/stats/students/tickets/:date/:to",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const date = decodeURIComponent(req.params.date);
    const to = decodeURIComponent(req.params.to);

    const ticketAttempt = await getAllTickets();

    if (ticketAttempt.errno !== undefined) {
      console.log(ticketAttempt);
      res.status(409).json({
        message: `Could not get all tickets. Error number ${ticketAttempt.errno}.`,
        counts: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got ticket count for each student for date '${date}'${
          to && ` to '${to}'`
        }.`,
        counts: getStudentTicketCount(ticketAttempt, date, to),
      });
    }
  }
);

app.get(
  "/stats/tickets/resolutionTime/histogram/:date/:to",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const date = decodeURIComponent(req.params.date);
    const to = decodeURIComponent(req.params.to);

    const ticketAttempt = await getAllTickets();

    if (ticketAttempt.errno !== undefined) {
      console.log(ticketAttempt);
      res.status(409).json({
        message: `Could not get all tickets. Error number ${ticketAttempt.errno}.`,
        times: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got resolution time histogram data for date '${date}'${
          to && ` to '${to}'`
        }.`,
        times: getResolutionTimeHistogramData(ticketAttempt, date, to),
      });
    }
  }
);

app.get(
  "/stats/lab/activity/:lab",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const lab = decodeURIComponent(req.params.lab);

    const ticketAttempt = await getAllTickets();

    if (ticketAttempt.errno !== undefined) {
      console.log(ticketAttempt);
      res.status(409).json({
        message: `Could not get all tickets. Error number ${ticketAttempt.errno}.`,
        activity: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got activity data for lab '${lab}'.`,
        activity: getLabActivity(ticketAttempt, lab),
      });
    }
  }
);

app.get(
  "/stats/module/activity/:module",
  ensureAuthenticated,
  ensureLeadPrivileges,
  async function (req, res) {
    const module = decodeURIComponent(req.params.module);

    const ticketAttempt = await getAllTickets();

    if (ticketAttempt.errno !== undefined) {
      console.log(ticketAttempt);
      res.status(409).json({
        message: `Could not get all tickets. Error number ${ticketAttempt.errno}.`,
        activity: null,
      });
    } else {
      res.status(200).json({
        message: `Successfully got activity data for module '${module}'.`,
        activity: getModuleActivity(ticketAttempt, module),
      });
    }
  }
);

const PORT = process.env.PORT || 5000;

server.listen(
  PORT,
  console.log(`CORS-enabled web server started on port ${PORT}`)
);
