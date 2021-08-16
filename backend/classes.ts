const { v4: uuidv4 } = require("uuid");

exports.Ticket = class Ticket {
  id: string;
  issueDescription: string;
  moduleCode: string;
  studentUsername: string;
  practical: string;
  labId: string;
  tags: string[];
  resolutionStatus?: string;
  creation_timestamp?: Date;
  close_timestamp?: Date;
  demonstratorUsername?: string;
  demAssigned_timestamp?: Date;

  constructor(
    issueDescription,
    moduleCode,
    studentUsername,
    practical,
    labId,
    tags,
    id = "T" + uuidv4(),
    resolutionStatus = "new",
    creation_timestamp = new Date(),
    close_timestamp = null,
    demonstratorUsername = null,
    demAssigned_timestamp = null
  ) {
    this.issueDescription = issueDescription;
    this.moduleCode = moduleCode;
    this.studentUsername = studentUsername;
    this.practical = practical;
    this.labId = labId;
    this.tags = tags;
    this.id = id;
    this.resolutionStatus = resolutionStatus;
    this.creation_timestamp = creation_timestamp;
    this.close_timestamp = close_timestamp;
    this.demonstratorUsername = demonstratorUsername;
    this.demAssigned_timestamp = demAssigned_timestamp;
  }

  assignDemonstrator(demonstratorUsername) {
    this.demonstratorUsername = demonstratorUsername;
    this.resolutionStatus = "inProgress";
    this.demAssigned_timestamp = new Date();
  }

  markClosed() {
    this.resolutionStatus = "closed";
    this.close_timestamp = new Date();
  }

  markMissed() {
    this.resolutionStatus = "missed";
    this.close_timestamp = new Date();
  }

  /**
   * A method, that JS/Mongo will use, to convert the group class into JSON for storage.
   * Ignores all methods and takes only standard properties.
   * @returns {null}
   */
  toJSON() {
    return {
      issueDescription: this.issueDescription,
      moduleCode: this.moduleCode,
      studentUsername: this.studentUsername,
      practical: this.practical,
      id: this.id,
      resolutionStatus: this.resolutionStatus,
      creation_timestamp: this.creation_timestamp,
      close_timestamp: this.close_timestamp,
      labId: this.labId,
      tags: this.tags,
      demonstratorUsername: this.demonstratorUsername,
      demAssigned_timestamp: this.demAssigned_timestamp,
    };
  }

  static fromJSON(jsn) {
    return new Ticket(
      jsn.issueDescription,
      jsn.moduleCode,
      jsn.studentUsername,
      jsn.practical,
      jsn.labId,
      jsn.tags,
      jsn.id,
      jsn.resolutionStatus,
      jsn.creation_timestamp,
      jsn.close_timestamp,
      jsn.demonstratorUsername,
      jsn.demAssigned_timestamp
    );
  }
};

exports.Message = class Message {
  type: string;
  sender: string;
  text: string;
  chat: string;
  creation_timestamp: any;
  imageSrc?: string;
  fileName?: string;

  constructor(
    type,
    sender,
    text,
    chat,
    imageSrc = undefined,
    fileName = undefined
  ) {
    if (!["text", "image", "file", "videoInvite"].includes(type)) return null;
    this.type = type;
    this.sender = sender;
    this.text = text;
    this.chat = chat;
    this.creation_timestamp = new Date();
    this.imageSrc = imageSrc;
    this.fileName = fileName;
  }
};

exports.Solution = class Solution {
  id: string;
  solutionDescription: string;
  solutionTitle: string;
  creation_timestamp?: Date;
  demonstratorUsername?: string;

  constructor(
    solutionDescription,
    solutionTitle,
    demonstratorUsername = null,
    id = "S" + uuidv4(),
    creation_timestamp = new Date()
  ) {
    this.solutionDescription = solutionDescription;
    this.solutionTitle = solutionTitle;
    this.id = id;
    this.creation_timestamp = creation_timestamp;
    this.demonstratorUsername = demonstratorUsername;
  }
};

exports.Lab = class Lab {
  id: string;
  labTitle: string;
  status: string;

  constructor(labTitle, status = "closed", id = "L" + uuidv4()) {
    this.labTitle = labTitle;
    this.status = status;
    this.id = id;
  }
};
