# codeHelper

codeHelper is a web application to assist in the management of University coding lab sessions.

## requirements

Ensure that you have npm version 7.15.0 or above, node version v14.16.0, mariadb version 15.1 Distrib 10.5.9 or above installed on your machine.

### setup

To run the application:

1. Configure the '.env' files in both the '/client' and '/backend' directories to suit your setup - selecting the correct ports and adding database credentials

2. Create the database 'managinglabs' (or other name that you have configured in the .env file)

3. Move into the '/client' directory and install the node modules by typing the command 'npm install'

4. Add the '/socketio-file-upload' directory to the 'client/node_modules/@types' directory

5. Run the React server by typing the command 'npm start' in the '/client' directory

6. Move into the '/backend' directory and install the node modules by typing the command 'npm install'

7. Run the express server by typing 'npm run devStart' in the '/backend' directory

8. Install the PeerJS library globally by typing the command 'npm install -g peer'

9. Run the PeerJS server on port 42684 (if that is how you have configured it in the '.env' files) by typing the command 'peerjs --port 42684 --path peerjs'

10. Visit the application in your browser (preferably Chrome) at http://localhost:22684/labs/ (or the port you specified for the react server)

11. Enjoy!

#### IMPORTANT

Note that the application will register every user, initially, as a student user with student privileges. Lab lead users are able to change roles and privileges in the app. A first lab lead account has been added to the database for you to use, either for testing or to assign privileges to your own account. The login details are as follows:

username: 'lablead1'
password: '3'

Note that the password is encrypted using the .env 'secretkey' variable and so will not work if you change it. If you wish to change the 'secretkey' variable, you will need to manually change the details in the database as follows:

- change the 'role' of your new, registered user from 'student' to 'labLead'
- add the row from the 'student' table, which corresponds to your new user, to the 'labLead' table
- remove the row from the 'student' table which corresponds to your new user

##### Thank you for your time!
