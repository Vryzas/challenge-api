<!-- ABOUT THE PROJECT -->

# About The Project

## Name:

Challenge API

### Built With

- [Node.js](https://nodejs.org/en/)
- [MySQL](https://www.mysql.com/)

<!-- GETTING STARTED -->

## Getting Started

After copying the code from the project, open terminal and navigate to the project folder using "cd <project/foder>".
Run the "npm i" command to install the necessary packages.
Start the server with the following command: "node server.js", you should receive the "App listening on port 3000..." message if all goes right.

### Prerequisites

You must have Node.js installed to run the server.
All info and instructions in https://nodejs.org/en/.

<!-- folder structure-->

### Structure

#### Main directory should contain the following folders/files:

\* Folders:

- models
- controllers
- routes
- utils
- node-modules

  \* Files:

- config.env
- .gitignore
- package.json
- package-lock.json
- server.js
- app.js
- (this) readme.md

#### Database contains 3 tables:

- Users(<ins>id</ins>, username, email, password)
- Userstats(<ins>id</ins>, user->Users, victories, defeats, draws)
- Matches(<ins>id</ins>, player1->Users, player2->Users, score1, score2, winner)
