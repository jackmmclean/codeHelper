CREATE TABLE tag (name VARCHAR (70), PRIMARY KEY (name));
CREATE TABLE auth (
	username VARCHAR(16) NOT NULL,
	password CHAR(60) NOT NULL,
	role VARCHAR(12),
	CONSTRAINT meaningful_role CHECK (role IN ("student", "demonstrator", "labLead")),
	PRIMARY KEY (username)
);
CREATE TABLE student (
	username VARCHAR(16) NOT NULL,
	name VARCHAR(70),
	PRIMARY KEY (username),
	FOREIGN KEY (username) REFERENCES auth(username) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE demonstrator (
	username VARCHAR(16) NOT NULL,
	name VARCHAR(70),
	PRIMARY KEY (username),
	FOREIGN KEY (username) REFERENCES auth(username) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE labLead (
	username VARCHAR(16) NOT NULL,
	name VARCHAR(70),
	PRIMARY KEY (username),
	FOREIGN KEY (username) REFERENCES auth(username) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE solution (
	id CHAR(37) NOT NULL,
	title VARCHAR(100) NOT NULL,
	demonstratorUsername VARCHAR(16) NOT NULL,
	creation_timestamp VARCHAR(60),
	FOREIGN KEY (demonstratorUsername) REFERENCES demonstrator(username) ON UPDATE CASCADE,
	solutionDescription VARCHAR(2000) NOT NULL,
	PRIMARY KEY (id)
);
CREATE TABLE lab (
	id CHAR(37) NOT NULL,
	title VARCHAR(70),
	status VARCHAR(6),
	CONSTRAINT lab CHECK (status IN ("open", "closed")),
	PRIMARY KEY (id)
);
CREATE TABLE module (
	code CHAR(6) NOT NULL,
	-- CONSTRAINT code_has_correct_format CHECK (code LIKE '[A-Z][A-Z]\d\d\d\d'),
	name VARCHAR(70) NOT NULL,
	labLeadUsername VARCHAR(16),
	PRIMARY KEY (code),
	FOREIGN KEY (labLeadUsername) REFERENCES labLead(username) ON UPDATE CASCADE
);
CREATE TABLE ticket (
	id CHAR(37) NOT NULL,
	issueDescription VARCHAR(2000) NOT NULL,
	moduleCode CHAR(6) NOT NULL,
	studentUsername VARCHAR(16) NOT NULL,
	practical VARCHAR(30),
	resolutionStatus VARCHAR(10),
	creation_timestamp VARCHAR(60) NOT NULL,
	labid CHAR(37),
	close_timestamp VARCHAR(60),
	demonstratorUsername VARCHAR(16),
	demAssigned_timestamp VARCHAR(60),
	solutionId CHAR(37),
	CONSTRAINT meaningful_resolution_status CHECK (
		resolutionStatus IN ("new", "missed", "inProgress", "closed")
	),
	PRIMARY KEY (id),
	FOREIGN KEY (moduleCode) REFERENCES module(code),
	FOREIGN KEY (studentUsername) REFERENCES student(username),
	FOREIGN KEY (labId) REFERENCES lab(id),
	FOREIGN KEY (demonstratorUsername) REFERENCES demonstrator(username),
	FOREIGN KEY (solutionId) REFERENCES solution(id)
);
-- CREATE TABLE attachment (
-- 	id CHAR(37) NOT NULL,
-- 	file BLOB NOT NULL,
-- 	caption VARCHAR(150),
-- 	ticketid CHAR(37),
-- 	ticket_attach_timestamp VARCHAR(60),
-- 	solutionid CHAR(37),
-- 	solution_attach_timestamp VARCHAR(60),
-- 	PRIMARY KEY (id),
-- 	FOREIGN KEY (ticketId) REFERENCES ticket(id) ON DELETE CASCADE ON UPDATE CASCADE,
-- 	FOREIGN KEY (solutionId) REFERENCES solution(id) ON DELETE CASCADE ON UPDATE CASCADE
-- );
CREATE TABLE hasTicketTag (
	ticketid CHAR(37) NOT NULL,
	name VARCHAR(70) NOT NULL,
	PRIMARY KEY (ticketId, name),
	FOREIGN KEY (ticketId) REFERENCES ticket(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (name) references tag(name) ON DELETE CASCADE
);
CREATE TABLE activityRecord (
	id int NOT NULL AUTO_INCREMENT,
	type VARCHAR(20) NOT NULL,
	username VARCHAR(16),
	ticketId CHAR(37),
	solutionId CHAR(37),
	resolutionStatusFrom VARCHAR(10),
	resolutionStatusTo VARCHAR(10),
	creation_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (username) REFERENCES auth(username) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY (id)
);
-- CREATE TABLE hasSolutionTag (
-- 	solutionid CHAR(37) NOT NULL,
-- 	name VARCHAR(70) NOT NULL,
-- 	PRIMARY KEY (solutionId, name),
-- 	FOREIGN KEY (solutionId) REFERENCES solution(id) ON DELETE CASCADE ON UPDATE CASCADE,
-- 	FOREIGN KEY (name) references tag(name) ON DELETE CASCADE
-- );
-- CREATE TABLE demonstratesInLab (
-- 	demonstratorUsername VARCHAR(16) NOT NULL,
-- 	labid CHAR(37) NOT NULL,
-- 	PRIMARY KEY (demonstratorUsername, labId),
-- 	FOREIGN KEY (demonstratorUsername) REFERENCES demonstrator(username) ON DELETE CASCADE ON UPDATE CASCADE,
-- 	FOREIGN KEY (labId) REFERENCES lab(id) ON DELETE CASCADE ON UPDATE CASCADE
-- );
-- CREATE TABLE demonstratesInMod (
-- 	demonstratorUsername VARCHAR(16) NOT NULL,
-- 	moduleCode CHAR (6) NOT NULL,
-- 	PRIMARY KEY (demonstratorUsername, moduleCode),
-- 	FOREIGN KEY (demonstratorUsername) REFERENCES demonstrator(username) ON DELETE CASCADE ON UPDATE CASCADE,
-- 	FOREIGN KEY (moduleCode) REFERENCES module(code) ON DELETE CASCADE ON UPDATE CASCADE
-- );
-- CREATE TABLE enrolledInMod (
-- 	studentUsername VARCHAR(16) NOT NULL,
-- 	moduleCode CHAR(6) NOT NULL,
-- 	PRIMARY KEY (studentUsername, moduleCode),
-- 	FOREIGN KEY (studentUsername) REFERENCES student(username) ON DELETE CASCADE ON UPDATE CASCADE,
-- 	FOREIGN KEY (moduleCode) REFERENCES module(code) ON DELETE CASCADE ON UPDATE CASCADE
-- );
CREATE TRIGGER labLead_to_demonstrator
AFTER
INSERT ON labLead FOR EACH ROW
INSERT INTO demonstrator (username, name)
VALUES (NEW.username, NEW.name);
-- activity history triggers
CREATE TRIGGER record_activity_student_register
AFTER
INSERT ON student FOR EACH ROW
INSERT INTO activityRecord (type, username)
VALUES ('studentRegister', NEW.username);
CREATE TRIGGER record_activity_demonstrator_register
AFTER
INSERT ON demonstrator FOR EACH ROW
INSERT INTO activityRecord (type, username)
VALUES ('demonstratorRegister', NEW.username);
CREATE TRIGGER record_activity_labLead_register
AFTER
INSERT ON labLead FOR EACH ROW
INSERT INTO activityRecord (type, username)
VALUES ('labLeadRegister', NEW.username);
CREATE TRIGGER record_activity_ticket_created
AFTER
INSERT ON ticket FOR EACH ROW
INSERT INTO activityRecord (type, username, ticketId)
VALUES ('ticketCreation', NEW.studentUsername, NEW.id);
CREATE TRIGGER record_activity_solution_created
AFTER
INSERT ON solution FOR EACH ROW
INSERT INTO activityRecord (type, username, solutionId)
VALUES (
		'solutionCreation',
		NEW.demonstratorUsername,
		NEW.id
	);
CREATE TRIGGER record_activity_ticket_changed
AFTER
UPDATE ON ticket FOR EACH ROW BEGIN
IF (OLD.demonstratorUsername IS NULL AND NEW.demonstratorUsername IS NOT NULL) THEN 
INSERT INTO activityRecord (type, username, ticketId)
VALUES (
		'demonstratorAssigned',
		NEW.demonstratorUsername,
		NEW.id
	);
END IF;
IF (OLD.resolutionStatus != NEW.resolutionStatus) THEN
INSERT INTO activityRecord (
		type,
		username,
		ticketId,
		resolutionStatusFrom,
		resolutionStatusTo
	)
VALUES (
		'ticketStatusChanged',
		NEW.demonstratorUsername,
		NEW.id,
		OLD.resolutionStatus,
		NEW.resolutionStatus
	);
END IF;
END;
CREATE TRIGGER record_activity_solution_edited
AFTER
UPDATE ON solution FOR EACH ROW BEGIN IF (
		(
			OLD.solutionDescription != NEW.solutionDescription
		)
		OR (OLD.title != NEW.title)
	) THEN
INSERT INTO activityRecord (type, username, solutionId)
VALUES (
		'solutionEdited',
		NEW.demonstratorUsername,
		NEW.id
	);
END IF;
END;