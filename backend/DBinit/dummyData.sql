INSERT INTO lab (id, title, status)
VALUES (
		'Labfd7753-e52a-49c9-bb80-8d7fd806959d',
		'First Year Lab',
		'closed'
	),
	(
		'Labfd7753-e52a-49c9-bb80-8d7fd8123456',
		'Second Year Lab',
		'closed'
	);
-- passwords==='lablead1' for current hash/salt
INSERT INTO auth (username, password, role)
VALUES ('lablead1','$2b$10$EpZ0HeEYgHk.U2xvmL7eduQRXf1RZVUE/W9Sqsi81y0NBE4S7axHC','labLead');
INSERT INTO labLead (username, name)
VALUES ('lablead1','lablead1');
INSERT INTO module (code, name, labLeadUsername)
VALUES 
	(
		'CS1002',
		'Object Oriented Programming',
		'lablead1'
	),
	(
		'CS1005',
		'Computer Science in Everyday Life',
		'lablead1'
	),
	(
		'CS2001',
		'Foundations of Computation',
		'lablead1'
	),
	(
		'CS2003',
		'The Internet and the Web: Concepts and Programming',
		'lablead1'
	),
	(
		'CS2101',
		'Foundations of Computation (Accelerated)',
		'lablead1'
	),
	('CS1003', 'Programming with Data', 'lablead1'),
	('CS1006', 'Programming Projects', 'lablead1'),
	('CS2002', 'Computer Systems', 'lablead1'),
	(
		'CS2006',
		'Advanced Programming Projects',
		'lablead1'
	);
INSERT INTO tag (name)
VALUES ('Python'),
	('Javascript'),
	('Java'),
	('Syntax Error');