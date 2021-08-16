const {
	combineTicketTagsIntoArray,
  } = require("./utils");

  const tagTicketArray = [
	 {
	  id: 'Tac65bd6d-9905-47f9-a15a-447f4b110fcf',
	  issueDescription: 'askoaslkdasdkasldasaskoaslkdasdkasldasaskoaslkdasdkasldasaskoaslkdasdkasldasaskoaslkdasdkasldasaskoaslkdasdkasldas',
	  studentUsername: 'teststudent',
	  practical: 'practical 1',
	  resolutionStatus: 'new',
	  creation_timestamp: '2021-08-09 11:43:19.641',
	  labId: 'Labfd7753-e52a-49c9-bb80-8d7fd806959d',
	  close_timestamp: null,
	  demonstratorUsername: null,
	  demAssigned_timestamp: null,
	  moduleCode: 'CS1002',
	  moduleName: 'Object Oriented Programming',
	  labLeadUsername: 'jack',
	  tags: 'Error Code 1452'
	},
	 {
	  id: 'Tac65bd6d-9905-47f9-a15a-447f4b110fcf',
	  issueDescription: 'askoaslkdasdkasldasaskoaslkdasdkasldasaskoaslkdasdkasldasaskoaslkdasdkasldasaskoaslkdasdkasldasaskoaslkdasdkasldas',
	  studentUsername: 'teststudent',
	  practical: 'practical 1',
	  resolutionStatus: 'new',
	  creation_timestamp: '2021-08-09 11:43:19.641',
	  labId: 'Labfd7753-e52a-49c9-bb80-8d7fd806959d',
	  close_timestamp: null,
	  demonstratorUsername: null,
	  demAssigned_timestamp: null,
	  moduleCode: 'CS1002',
	  moduleName: 'Object Oriented Programming',
	  labLeadUsername: 'jack',
	  tags: 'Python'
	},
	 {
	  id: 'Tac65bd6d-9905-47f9-a15a-447f4b110fcf',
	  issueDescription: 'askoaslkdasdkasldasaskoaslkdasdkasldasaskoaslkdasdkasldasaskoaslkdasdkasldasaskoaslkdasdkasldasaskoaslkdasdkasldas',
	  studentUsername: 'teststudent',
	  practical: 'practical 1',
	  resolutionStatus: 'new',
	  creation_timestamp: '2021-08-09 11:43:19.641',
	  labId: 'Labfd7753-e52a-49c9-bb80-8d7fd806959d',
	  close_timestamp: null,
	  demonstratorUsername: null,
	  demAssigned_timestamp: null,
	  moduleCode: 'CS1002',
	  moduleName: 'Object Oriented Programming',
	  labLeadUsername: 'jack',
	  tags: 'Syntax Error'
	},
  ]

  const expectedTicket = {
	id: 'Tafe0981e-aeaa-4bfb-b451-4732f2209ded',
	issueDescription: 'askoaslkdasdkasldasaskoaslkdasdkasldasaskoaslkdasdkasldasaskoaslkdasdkasldas',
	studentUsername: 'teststudent2',
	practical: 'practical 4',
	resolutionStatus: 'new',
	creation_timestamp: '2021-08-09 11:43:40.811',
	labId: 'Labfd7753-e52a-49c9-bb80-8d7fd806959d',
	close_timestamp: null,
	demonstratorUsername: null,
	demAssigned_timestamp: null,
	moduleCode: 'CS1002',
	moduleName: 'Object Oriented Programming',
	labLeadUsername: 'jack',
	tags: ['Error Code 1452', 'Python', 'Syntax Error']
  }


test('should combine multiple ticket lines with different tags into one ticket with multiple tags', ()=>{
	expect(combineTicketTagsIntoArray(tagTicketArray)).toBe(expectedTicket)
})