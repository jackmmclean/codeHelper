const studentUsername = 'teststudent'
const studentPassword = '123456'
const demonstratorUsername = 'demonstrator1'
const demonstratorPassword = '123456'
const labLeadUsername = 'lablead1'
const labLeadPassword = 'xAdjjL13'
const moduleCode = 'CS2001'
const practical = 'P1 - hello world!'
const problemDescription = 'I am having issues with saying hello world on the console, please please please help me'
const labName = 'Second Year Lab'
const messageContentDem = 'hello student I am here to help kER£jfjd34XX£££w344e*^sas'
const messageContentStud = 'hello dem I am here to be helped [;435]\}$ddf3rf3^&%e]'

describe('Visiting Website as Lab Lead to open lab', () => {

	beforeEach(() => {
		// before each test, we can automatically preserve the
		// cookies. this means they
		// will not be cleared before the NEXT test starts.

		Cypress.Cookies.preserveOnce('my_lil_cookie')
	})

	it('loads the page', () => {
		cy.visit('https://jm461.host.cs.st-andrews.ac.uk/labs/demonstrator/desk')
	})

	it('shows login', () => {
		cy.contains('Login')
	})

	it('sets cookie and currentUser when we log in as lablead', function () {

		cy.visit('https://jm461.host.cs.st-andrews.ac.uk/labs/')

		cy.get('div[id=username]').within(() => {
			cy.get('input').type(labLeadUsername)
		})

		cy.get('div[id=password]').within(() => {
			cy.get('input').type(`${labLeadPassword}{enter}`)
		})

		cy.url().should('include', '/demonstrator/desk')

		cy.getCookie('my_lil_cookie').should('exist')

		cy.get('a[id=currentUser]').should('contain', labLeadUsername)

	})
	it('shows correct nav and contents for lab lead', function () {

		cy.get('nav').within(() => {
			cy.get('a').should('contain', 'Admin')
		})

		cy.get('nav[id=demonstratorNav]').within(() => {
			cy.get('a').should('contain', 'Messages')
			cy.get('a').should('contain', 'Help Desk')
			cy.get('a').should('contain', 'Summary')
			cy.get('a').should('contain', 'Activity')
		})

	})

	it('visits admin to open lab', function () {

		cy.get('a').contains('Admin').click()

		cy.get('a').contains('Labs').click()

		cy.get('tr').contains(labName).parent().within(() => {
			cy.get('button').click()
		})

		cy.get('button').contains('Open').click()
	})

	it('logs lablead out and redirects to login', function () {
		cy.get('button[id=logoutButton]').contains('Logout').click()
		cy.url().should('include', '/login')

	})

})

describe('Visiting Website as Student to post ticket', () => {

	beforeEach(() => {
		// before each test, we can automatically preserve the
		// cookies. this means they
		// will not be cleared before the NEXT test starts.

		Cypress.Cookies.preserveOnce('my_lil_cookie')
	})

	it('loads the page', () => {
		cy.visit('https://jm461.host.cs.st-andrews.ac.uk/labs/demonstrator/desk')
	})

	it('shows login', () => {
		cy.contains('Login')
	})

	it('sets cookie when we log in as student', function () {

		cy.visit('https://jm461.host.cs.st-andrews.ac.uk/labs/')

		cy.get('div[id=username]').within(() => {
			cy.get('input').type(studentUsername)
		})

		cy.get('div[id=password]').within(() => {
			cy.get('input').type(`${studentPassword}{enter}`)
		})

		cy.url().should('include', '/tickets/post')

		cy.getCookie('my_lil_cookie').should('exist')

		cy.get('a[id=currentUser]').should('contain', studentUsername)

	})
	it('does not show demonstrator nav for student', function () {

		cy.get('nav[id=demonstratorNav').should('not.exist');

	})
	it('fills in ticket posting form and submits', function () {

		cy.get('select').select(moduleCode)

		cy.get('div[id=practical]').within(() => {
			cy.get('input').type(practical)
		})

		cy.get('div[id=issueDescription]').within(() => {
			cy.get('textarea').type(problemDescription)
		})

		cy.get('button').contains('Submit').click()

		cy.get('button').contains('Syntax Error').click()

		cy.get('button').contains('Post').click()


	})

	it('redirects to queue page and displays queue', function () {

		cy.get('div').should('contain', 'Your ticket has been posted')
		cy.url().should('include', '/tickets/post')

	})

	it('logs student out and redirects to login', function () {

		cy.get('button[id=logoutButton]').contains('Logout').click()
		cy.url().should('include', '/login')

	})
})

describe('Visiting Website as Demonstrator to Assign and Chat', () => {

	beforeEach(() => {
		// before each test, we can automatically preserve the
		// cookies. this means they
		// will not be cleared before the NEXT test starts.

		Cypress.Cookies.preserveOnce('my_lil_cookie')
	})

	it('loads the page', () => {
		cy.visit('https://jm461.host.cs.st-andrews.ac.uk/labs/demonstrator/desk')
	})

	it('sets cookie and currentUser when we log in as demonstrator', function () {

		cy.visit('https://jm461.host.cs.st-andrews.ac.uk/labs/')

		cy.get('div[id=username]').within(() => {
			cy.get('input').type(demonstratorUsername)
		})

		cy.get('div[id=password]').within(() => {
			cy.get('input').type(`${demonstratorPassword}{enter}`)
		})

		cy.url().should('include', '/demonstrator/desk')

		cy.getCookie('my_lil_cookie').should('exist')

		cy.get('a[id=currentUser]').should('contain', demonstratorUsername)

	})
	it('shows correct nav and contents for demonstrator', function () {

		cy.get('nav').within(() => {
			cy.get('a').should('not.contain', 'Admin')
		})

		cy.get('nav[id=demonstratorNav]').within(() => {
			cy.get('a').should('contain', 'Messages')
			cy.get('a').should('contain', 'Help Desk')
			cy.get('a').should('not.contain', 'Summary')
			cy.get('a').should('not.contain', 'Activity')
		})
	})

	it('finds the ticket on the help desk', () => {
		cy.visit('https://jm461.host.cs.st-andrews.ac.uk/labs/demonstrator/desk')

		cy.get('td').contains(studentUsername)

		cy.get('td').contains(studentUsername)

		cy.get('div').contains(moduleCode)

		cy.get('div').contains(practical)

		cy.get('p').contains(problemDescription)

	})

	it('sends a message to student', () => {

		cy.get('a[data-rb-event-key=message]').click()

		cy.get('input[type=text]').type(`${messageContentDem}{enter}`)

	})

	it('logs demonstrator out and redirects to login', function () {

		cy.get('button[id=logoutButton]').contains('Logout').click()
		cy.url().should('include', '/login')

	})
})


describe('Visiting Website as Student to Check and Send Message', () => {

	beforeEach(() => {
		// before each test, we can automatically preserve the
		// cookies. this means they
		// will not be cleared before the NEXT test starts.

		Cypress.Cookies.preserveOnce('my_lil_cookie')
	})

	it('loads the page', () => {
		cy.visit('https://jm461.host.cs.st-andrews.ac.uk/labs/demonstrator/desk')
	})

	it('shows login', () => {
		cy.contains('Login')
	})

	it('sets cookie when we log in as student', function () {

		cy.visit('https://jm461.host.cs.st-andrews.ac.uk/labs/')

		cy.get('div[id=username]').within(() => {
			cy.get('input').type(studentUsername)
		})

		cy.get('div[id=password]').within(() => {
			cy.get('input').type(`${studentPassword}{enter}`)
		})

		cy.url().should('include', '/tickets/post')

		cy.getCookie('my_lil_cookie').should('exist')

		cy.get('a[id=currentUser]').should('contain', studentUsername)

	})

	it('does not show demonstrator nav for student', function () {

		cy.get('nav[id=demonstratorNav').should('not.exist');

	})

	it('receives demonstrator message and sends message', function () {

		cy.get('div').should('contain', messageContentDem)

		cy.get('input[type=text]').type(`${messageContentStud}{enter}`)

	})

	it('logs student out and redirects to login', function () {

		cy.get('button[id=logoutButton]').contains('Logout').click()
		cy.url().should('include', '/login')

	})
})

describe('Visiting Website as Demonstrator to Check Message and Close', () => {

	beforeEach(() => {
		// before each test, we can automatically preserve the
		// cookies. this means they
		// will not be cleared before the NEXT test starts.

		Cypress.Cookies.preserveOnce('my_lil_cookie')
	})

	it('loads the page', () => {
		cy.visit('https://jm461.host.cs.st-andrews.ac.uk/labs/demonstrator/desk')
	})

	it('sets cookie and currentUser when we log in as demonstrator', function () {

		cy.visit('https://jm461.host.cs.st-andrews.ac.uk/labs/')

		cy.get('div[id=username]').within(() => {
			cy.get('input').type(demonstratorUsername)
		})

		cy.get('div[id=password]').within(() => {
			cy.get('input').type(`${demonstratorPassword}{enter}`)
		})

		cy.url().should('include', '/demonstrator/desk')

		cy.getCookie('my_lil_cookie').should('exist')

		cy.get('a[id=currentUser]').should('contain', demonstratorUsername)

	})

	it('shows correct nav and contents for demonstrator', function () {

		cy.get('nav').within(() => {
			cy.get('a').should('not.contain', 'Admin')
		})

		cy.get('nav[id=demonstratorNav]').within(() => {
			cy.get('a').should('contain', 'Messages')
			cy.get('a').should('contain', 'Help Desk')
			cy.get('a').should('not.contain', 'Summary')
			cy.get('a').should('not.contain', 'Activity')
		})
	})

	it('finds the ticket on the help desk', () => {
		cy.visit('https://jm461.host.cs.st-andrews.ac.uk/labs/demonstrator/desk')

		cy.get('td').contains(studentUsername)

		cy.get('td').contains(studentUsername)

		cy.get('div').contains(moduleCode)

		cy.get('div').contains(practical)

		cy.get('p').contains(problemDescription)

	})

	it('checks for message', () => {

		cy.get('a[data-rb-event-key=message]').click()

		cy.get('div').should('contain', messageContentStud)

	})

	it('marks the ticket as resolved', () => {

		cy.get('a[data-rb-event-key=info]').click()

		cy.get('button').contains('Mark as Resolved').click()

		cy.get('button').contains('Close').click()

	})

	it('logs demonstrator out and redirects to login', function () {

		cy.get('button[id=logoutButton]').contains('Logout').click()
		cy.url().should('include', '/login')

	})
})

describe('Visiting Website as Lab Lead to check activity and close lab', () => {

	beforeEach(() => {
		// before each test, we can automatically preserve the
		// cookies. this means they
		// will not be cleared before the NEXT test starts.

		Cypress.Cookies.preserveOnce('my_lil_cookie')
	})

	it('loads the page', () => {
		cy.visit('https://jm461.host.cs.st-andrews.ac.uk/labs/demonstrator/desk')
	})

	it('shows login', () => {
		cy.contains('Login')
	})

	it('sets cookie and currentUser when we log in as lablead', function () {

		cy.visit('https://jm461.host.cs.st-andrews.ac.uk/labs/')

		cy.get('div[id=username]').within(() => {
			cy.get('input').type(labLeadUsername)
		})

		cy.get('div[id=password]').within(() => {
			cy.get('input').type(`${labLeadPassword}{enter}`)
		})

		cy.url().should('include', '/demonstrator/desk')

		cy.getCookie('my_lil_cookie').should('exist')

		cy.get('a[id=currentUser]').should('contain', labLeadUsername)

	})
	it('shows correct nav and contents for lab lead', function () {

		cy.get('nav').within(() => {
			cy.get('a').should('contain', 'Admin')
		})

		cy.get('nav[id=demonstratorNav]').within(() => {
			cy.get('a').should('contain', 'Messages')
			cy.get('a').should('contain', 'Help Desk')
			cy.get('a').should('contain', 'Summary')
			cy.get('a').should('contain', 'Activity')
		})

	})
	it('check activity for correct content', function () {

		cy.get('a').contains('Activity').click()

		cy.get('h5').should('contain', `'${studentUsername}' created a ticket`)

		cy.get('h5').should('contain', `'${demonstratorUsername}' was assigned to a ticket`)

		cy.get('h5').should('contain', `'${demonstratorUsername}' changed the status of a ticket from 'new' to 'inProgress'`)

		cy.get('h5').should('contain', `'${demonstratorUsername}' changed the status of a ticket from 'inProgress' to 'closed'`)

	})

	it('visits admin to close lab', function () {

		cy.get('a').contains('Admin').click()

		cy.get('a').contains('Labs').click()

		cy.get('tr').contains(labName).parent().within(() => {
			cy.get('button').click()
		})

		cy.get('button').contains('Close').click()
	})
	it('logs lablead out and redirects to login', function () {

		cy.get('button[id=logoutButton]').contains('Logout').click()
		cy.url().should('include', '/login')

	})

	it('shows login again', () => {
		cy.contains('Login')
	})
})