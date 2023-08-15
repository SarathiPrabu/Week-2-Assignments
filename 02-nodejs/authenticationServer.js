/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();

var userDatabase = [];
function userSignUp(req, res) {
  var user = req.body;
  let userExistFlag = false;
  for (var i = 0; i < userDatabase.length; i++) {
    if (userDatabase[i].email === user.email) {
      userExistFlag = true;
    }
  }
  if (userExistFlag) {
    res.status(400).send("ID already exists");
  }
  else {
    userDatabase.push(user);
    res.status(201).send("Signup successful");
  }

}
function login(email, password) {
  for (var i = 0; i < userDatabase.length; i++) {
    if (userDatabase[i].email === email && userDatabase[i].password === password) {
      return { success: true, index: i };
    }
  }
  return { success: false, index: -1 };
}

function userLogin(req, res) {
  var user = req.body;
  var result = login(user.email, user.password);
  if (result.success) {
    let usersToReturn = [];
    var ansObj = {
      email: userDatabase[result.index].email,
      firstName: userDatabase[result.index].firstName,
      lastName: userDatabase[result.index].lastName,
    };
    usersToReturn.push(ansObj);
    res.status(200).send(ansObj);
  } else {
    res.status(401).send("Unauthorized");
  }
}

function fetchData(req, res) {
  var user = req.headers;
  var result = login(user.email, user.password);

  if (result.success) {
    var users = [];
    for (var i = 0; i < userDatabase.length; i++) {
      users.push({
        firstName: userDatabase[i].firstName,
        lastName: userDatabase[i].lastName,
        email: userDatabase[i].email
      });
    }
    res.status(200).send({
      users
    });
  } else {
    res.status(401).send("Unauthorized");
  }
}

app.use(express.json());
app.post('/signup', userSignUp);
app.post('/login', userLogin);
app.get('/data', fetchData);
app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});
// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`)
// })

module.exports = app;
