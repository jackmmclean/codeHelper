//mysql2 works with MariaDB (cite https://www.npmjs.com/package/mariadb)

var mysql = require("mysql2/promise");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session); // used to create a db table to store session data

const { combineTicketTagsIntoArray } = require("./utils");

const options = {
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_DB_USERNAME,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.APP_NAME,
  multipleStatements: true,
};

module.exports.options = options;

var pool = mysql.createPool(options);

module.exports.sessionStore = new MySQLStore(
  {
    checkExpirationInterval: 900000, // How frequently expired sessions will be cleared; milliseconds.
    expiration: 86400000, // The maximum age of a valid session; milliseconds.
    createDatabaseTable: true, // Whether or not to create the sessions database table, if one does not already exist.
    connectionLimit: 1,
    schema: {
      tableName: "LoginRequests",
      columnNames: {
        session_id: "loginID",
        expires: "expires",
        data: "data",
      },
    },
  },
  pool
);

pool.getConnection(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + pool.threadId);
});

// Convert SQL table creation file into string
var fs = require("fs");
const dbTablesCreation = fs
  .readFileSync("./DBinit/dbTablesSetup.sql")
  .toString();

// Make query to the database to create using the SQL table def file
pool
  .query(dbTablesCreation)
  .then(() => {
    // Make query to db to insert dummy data
    const dummyData = fs.readFileSync("./DBinit/dummyData.sql").toString();
    pool.query(dummyData).catch((err) => {
      if (err.errno === 1062) {
        console.log(
          "Dummy data already inserted, continuing without insertion."
        );
        return;
      }
      console.log(err);
    });
  })
  .catch((err) => {
    if (err.errno === 1050) {
      console.log("Table(s) already exist, continuing without creation.");
      return;
    }
    console.log(err);
  });

//////////////////////////////////////////
//---------------USERS DB---------------//
//////////////////////////////////////////

async function registerUser(username, password, role) {
  //   const query = `INSERT INTO auth (username,password,role) VALUES ('${username}','${password}','${role}');`;
  const query = `INSERT INTO auth (username,password,role) VALUES (?,?,?);`;

  try {
    let res = await pool.query({
      sql: query,
      values: [username, password, role],
    });
    console.log(`Registered '${username}' in auth.`);
    return res;
  } catch (e) {
    console.log(`Failed to register '${username}' in auth.`);
    return e;
  }
}

module.exports.insertStudent = async function ({ username, name, password }) {
  let insertAttempt = await registerUser(username, password, "student");
  if (insertAttempt.errno !== undefined) {
    return insertAttempt;
  }

  //   const query = `INSERT INTO student (username,name) VALUES ('${username}','${name}');`;
  const query = `INSERT INTO student (username,name) VALUES (?,?);`;

  try {
    let res = await pool.query({ sql: query, values: [username, name] });
    console.log(`Registered '${username}' in student.`);
    return res;
  } catch (e) {
    console.log(`Failed to register '${username}' in student.`);
    return e;
  }
};

module.exports.findOneUser = async function (username) {
  //   const query = `SELECT * FROM auth WHERE username = '${username}'`;
  const query = `SELECT * FROM auth WHERE username = ?`;

  const res = await pool.query({ sql: query, values: [username] });
  return res[0][0];
};

//////////////////////////////////////////
//--------------TICKETS DB--------------//
//////////////////////////////////////////

module.exports.insertTicket = async function (ticketObject) {
  const tagNames = ticketObject.tags.map((tagObj) => tagObj.name);
  delete ticketObject.tags;

  //   let values = '';
  //   for (let value of Object.values(ticketObject)) {
  //     values += `'${value}',`;
  //   }
  //   values = values.slice(0, values.length - 1).replace(/'null'/g, "NULL");

  let qs = "";
  for (let value of Object.values(ticketObject)) {
    qs += `?,`;
  }
  qs = qs.slice(0, qs.length - 1);

  const keys = Object.keys(ticketObject).toString();

  const ticketQuery = `INSERT INTO ticket (${keys}) VALUES (${qs});`;

  try {
    const res = await pool.query({
      sql: ticketQuery,
      values: Object.values(ticketObject),
    });
    if (tagNames.length === 0) return res;
  } catch (e) {
    console.log(e);
    return e;
  }

  //   const queryValues = tagNames
  //     .map((name) => `('${ticketObject.id}','${name}')`)
  //     .toString();

  // const tagsQuery = `INSERT INTO hasTicketTag (ticketid, name) VALUES ${queryValues}`;
  var res;
  for (let name of tagNames) {
    const tagsQuery = `INSERT INTO hasTicketTag (ticketid, name) VALUES (?,?)`;
    try {
      res = await pool.query({
        sql: tagsQuery,
        values: [ticketObject.id, name],
      });
      console.log(`Ticket with ID '${ticketObject.id}' inserted!`);
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  return res;
};

module.exports.getAllModules = async function () {
  const query = `SELECT * FROM ${options.database}.module;`;

  try {
    let res = await pool.query(query);
    return res[0];
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.deleteModule = async function (moduleCode: string) {
  const removeModuleQuery = `DELETE FROM module WHERE code='${moduleCode}';`;
  try {
    const res = await pool.query(removeModuleQuery);
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.insertModule = async function (
  moduleName: string,
  moduleCode: string,
  labLeadUsername: string
) {
  const query = `INSERT INTO module (code, name, labLeadUsername) VALUES (?,?,?);`;
  try {
    const res = await pool.query({
      sql: query,
      values: [moduleName, moduleCode, labLeadUsername],
    });
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.getAllLabs = async function () {
  const query = `SELECT * FROM ${options.database}.lab;`;

  try {
    let res = await pool.query(query);
    return res[0];
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.deleteLab = async function (labId: string) {
  const removeLabQuery = `DELETE FROM lab WHERE id='${labId}';`;
  try {
    const res = await pool.query(removeLabQuery);
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.insertLab = async function ({ id, labTitle, status }) {
  const query = `INSERT INTO lab (id, title, status) VALUES (?,?,?);`;
  console.log("query", query);
  try {
    const res = await pool.query({
      sql: query,
      values: [id, labTitle, status],
    });
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.changeLabStatus = async function (toStatus, labId) {
  const query = `UPDATE lab SET status = '${toStatus}' WHERE id='${labId}';`;

  try {
    let res = await pool.query(query);
    return res[0];
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.labIsClosed = async function (labId) {
  const query = `SELECT status FROM lab WHERE id='${labId}';`;

  try {
    let res = await pool.query(query);

    return res[0][0].status === "closed";
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.getAllTickets = async function () {
  const query = `SELECT * FROM ${options.database}.ticket;`;

  try {
    let res = await pool.query(query);
    return res[0];
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.getAllLiveTickets = async function () {
  const fields =
    "id, issueDescription, studentUsername, practical, resolutionStatus, creation_timestamp, labId, close_timestamp, demonstratorUsername, demAssigned_timestamp, moduleCode, module.name as moduleName, labLeadUsername, hasTicketTag.name as tags";
  const table =
    "ticket LEFT JOIN module ON ticket.moduleCode=module.code LEFT JOIN hasTicketTag ON ticket.id=hasTicketTag.ticketId";
  const query = `SELECT ${fields} FROM ${table} WHERE resolutionStatus='inProgress' OR resolutionStatus='new';`;

  try {
    let res = await pool.query(query);
    return combineTicketTagsIntoArray(res[0]);
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.getStudentsLiveTicket = async function (studentUsername) {
  const fields =
    "id, issueDescription, studentUsername, practical, resolutionStatus, creation_timestamp, labId, close_timestamp, demonstratorUsername, demAssigned_timestamp, moduleCode, module.name as moduleName, labLeadUsername, hasTicketTag.name as tags";
  const table =
    "ticket LEFT JOIN module ON ticket.moduleCode=module.code LEFT JOIN hasTicketTag ON ticket.id=hasTicketTag.ticketId";
  const query = `SELECT ${fields} FROM ${table} WHERE ((resolutionStatus='inProgress' OR resolutionStatus='new') AND studentUsername='${studentUsername}');`;

  try {
    let res = await pool.query(query);
    return combineTicketTagsIntoArray(res[0])[0];
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.getTicketsByTag = async function (tagName) {
  const fields =
    "id, issueDescription, studentUsername, practical, resolutionStatus, creation_timestamp, labId, solutionId, close_timestamp, demonstratorUsername, demAssigned_timestamp, moduleCode, module.name as moduleName, labLeadUsername, hasTicketTag.name as tags";
  const table =
    "ticket LEFT JOIN module ON ticket.moduleCode=module.code LEFT JOIN hasTicketTag ON ticket.id=hasTicketTag.ticketId";
  const query = `SELECT ${fields} FROM ${table} WHERE  hasTicketTag.name=?;`;

  try {
    let res = await pool.query({ sql: query, values: [tagName] });
    return res[0];
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.getTicketsByStudent = async function (studentUsername) {
  const fields =
    "id, issueDescription, studentUsername, practical, resolutionStatus, creation_timestamp, labId, close_timestamp, demonstratorUsername, solutionId, demAssigned_timestamp, moduleCode, module.name as moduleName, labLeadUsername, hasTicketTag.name as tags";
  const table =
    "ticket LEFT JOIN module ON ticket.moduleCode=module.code LEFT JOIN hasTicketTag ON ticket.id=hasTicketTag.ticketId";
  const query = `SELECT ${fields} FROM ${table} WHERE  studentUsername=?;`;

  try {
    let res = await pool.query({ sql: query, values: [studentUsername] });
    return combineTicketTagsIntoArray(res[0]);
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.markAllLiveTicketsAsMissed = async function (labId: string) {
  const query = `UPDATE ticket SET resolutionStatus = 'missed' WHERE (labid='${labId}' AND (resolutionStatus = 'new' OR resolutionStatus = 'inProgress'));`;

  try {
    let res = await pool.query(query);
    return res[0];
  } catch (e) {
    console.log(e);
    return e;
  }
};

// module.exports.getTicketById = async function (id: string) {
//   const query = `SELECT * FROM ${options.database}.ticket WHERE id='${id}';`;
//   try {
//     let res = await pool.query(query);
//     return res[0];
//   } catch (e) {
//     console.log(e);
//     return e;
//   }
// };

module.exports.changeTicketStatus = async function (
  id: string,
  toStatus: string
) {
  const query =
    toStatus === "closed"
      ? `UPDATE ticket SET resolutionStatus = '${toStatus}', close_timestamp='${new Date()}' WHERE id='${id}';`
      : `UPDATE ticket SET resolutionStatus = '${toStatus}' WHERE id='${id}';`;

  try {
    let res = await pool.query(query);
    return res[0];
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.changeTicketDemonstrator = async function (
  id: string,
  toDemonstrator: string
) {
  const query = `UPDATE ticket SET demonstratorUsername = '${toDemonstrator}', demAssigned_timestamp = '${new Date()}' WHERE id='${id}';`;

  try {
    let res = await pool.query(query);
    return res[0];
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.getAllTags = async function () {
  const query = `SELECT * FROM ${options.database}.tag;`;

  try {
    let res = await pool.query(query);
    return res[0];
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.insertTag = async function (tagName) {
  const query = `INSERT INTO tag (name) VALUES (?);`;

  try {
    let res = await pool.query({ sql: query, values: [tagName] });
    console.log(`Tag '${tagName}' inserted!`);
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.insertSolution = async function ({
  id,
  solutionDescription,
  solutionTitle,
  creation_timestamp,
  demonstratorUsername,
}) {
  const query = `INSERT INTO solution (id, solutionDescription, title, creation_timestamp, demonstratorUsername) VALUES (?,?,?,?,?);`;
  try {
    let res = await pool.query({
      sql: query,
      values: [
        id,
        solutionDescription,
        solutionTitle,
        creation_timestamp,
        demonstratorUsername,
      ],
    });
    console.log(`Solution with id '${id}' inserted!`);
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.updateSolution = async function ({
  id,
  solutionDescription,
  solutionTitle,
  demonstratorUsername,
}) {
  const query = `UPDATE solution SET solutionDescription = '${solutionDescription}', title = '${solutionTitle}', demonstratorUsername = '${demonstratorUsername}' WHERE id = '${id}';`;
  try {
    let res = await pool.query(query);
    console.log(`Solution with id '${id}' edited!`);
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.assignTicketSolution = async function (ticketId, solutionId) {
  const query = `UPDATE ticket SET solutionId = '${solutionId}' WHERE id = '${ticketId}';`;
  try {
    let res = await pool.query(query);
    console.log(
      `Assigned solution with id '${solutionId}' assigned to ticket with id '${ticketId}'!`
    );
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.getAllUsers = async function () {
  const studentQuery = `SELECT name, username, role FROM student NATURAL JOIN auth;`;
  const demonstratorQuery = `SELECT name, username, role FROM demonstrator NATURAL JOIN auth;`;
  //const labLeadQuery = `SELECT name, username, role FROM labLead NATURAL JOIN auth;`;

  var results;

  try {
    let res = await pool.query(studentQuery);
    results = res[0];
  } catch (e) {
    console.log(e);
    return e;
  }

  try {
    let res = await pool.query(demonstratorQuery);
    results = [...results, ...res[0]];
    return results;
  } catch (e) {
    console.log(e);
    return e;
  }

  //   try {
  //     let res = await pool.query(labLeadQuery);
  //     results = [...results, ...res[0]];
  //     return results;
  //   } catch (e) {
  //     console.log(e);
  //     return e;
  //   }
};

module.exports.changeRole = async function (username: string, toRole: string) {
  const possibleOldRoleTables = ["student", "demonstrator", "labLead"].filter(
    (role) => role !== toRole
  );
  const checkOldRoleTableQuery = `SELECT * FROM ${possibleOldRoleTables[0]} WHERE username='${username}'`;
  var oldRole;
  try {
    let res = await pool.query(checkOldRoleTableQuery);
    oldRole =
      res[0].length !== 0 ? possibleOldRoleTables[0] : possibleOldRoleTables[1];
  } catch (e) {
    console.log(e);
    return e;
  }

  const userWeAreMovingQuery = `SELECT * FROM ${oldRole} WHERE username='${username}';`;
  var userWeAreMoving;
  try {
    const res = await pool.query(userWeAreMovingQuery);
    userWeAreMoving = res[0][0];
    if (!userWeAreMoving)
      throw new Error(`error, user not found in ${oldRole}`);
  } catch (e) {
    console.log(e);
    return e;
  }

  const removeFromOldRolesQuery = `DELETE FROM ${oldRole} WHERE username='${username}';`;
  try {
    const res = await pool.query(removeFromOldRolesQuery);
  } catch (e) {
    console.log(e);
    return e;
  }

  const insertToNewRoleQuery = `INSERT INTO ${toRole} (username, name) VALUES ('${userWeAreMoving.username}','${userWeAreMoving.name}');`;
  try {
    const res = await pool.query(insertToNewRoleQuery);
  } catch (e) {
    console.log(e);
    if (oldRole !== "labLead" && toRole !== "demonstrator" && e.errno !== 1062)
      return e;
  }

  const authQuery = `UPDATE auth SET role='${toRole}' WHERE username='${username}';`;
  try {
    const res = await pool.query(authQuery);
    return res[0];
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.getSolutions = async function (ticketId = "all") {
  const query =
    ticketId === "all"
      ? `SELECT * FROM ${options.database}.solution`
      : `SELECT * FROM ${options.database}.solution WHERE id = (SELECT solutionId from ${options.database}.ticket WHERE id = '${ticketId}');`;

  try {
    let res = await pool.query(query);
    return res[0];
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.getActivity = async function () {
  const query = `SELECT * FROM activityRecord`;

  try {
    let res = await pool.query(query);
    return res[0];
  } catch (e) {
    console.log(e);
    return e;
  }
};
