const {checkEmptyEmails, getUserByEmail, generateRandomString, urlsForUser} = require('./helpers.js');
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080; 
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name : 'user_id',
  keys: ['id']
}));

//Define empty users object to store users upon registration
const users = {};

//Define URL Database which will store data inputed by all users on the application. The two object currently stored are an example of how the data will look to users.
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: 'd34Fnd', date: 'Thur Oct 3 2019'},
  "9sm5xK": {longURL: "http://www.google.com", userID: 'wo34sX', date: 'Thur Oct 3 2019'}
};


app.get("/", (req, res) => {
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
});

// Error page is displayed in situations where users are not allowed to access certain pages.
app.get("/error", (req,res) =>{
  let user = undefined;
  let templateVars = {user};

  res.render("error", templateVars);
});

// Home page for the application when logged in.
app.get("/urls", (req,res) => {
  let user_id = req.session.user_id;
  let user = users[user_id];
  //urlsForUser function creates an object full of URLs created by that specific user.
  let userURLs = urlsForUser(user_id, urlDatabase);
  let templateVars = {urls: userURLs, user};

  // If user is not logged in, they will be redirected to the error page.
  if (user === undefined) {
    res.redirect("/error");
  } else {
  res.render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req,res) => {
  let user = users[req.session.user_id];

  if (user === undefined) {
    res.redirect("/login");
  } else {
    let templateVars = {user};
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req,res) => {
  let userID = req.session.user_id;
  let user = users[userID];
  let urls = urlsForUser(userID, urlDatabase); 
  let templateVars = {shortURL: req.params.shortURL, urls, user};

  //Check to see if User is logged in, then if that user owns the URL that is being accessed.
  if (user !== undefined && urls[req.params.shortURL] !== undefined) {
    res.render("urls_show", templateVars);
  } else {
    res.send("<h2>Not permitted to view this TinyURL!</h2><a href='/'>Login to view your URLs</a>");
  }
});

app.get("/register", (req, res) => {
  let user = users[req.session.user_id];
  let templateVars = {user};

  if (user !== undefined) {
    res.redirect("/urls");
  } else {
    res.render("register_user", templateVars);
  }
});

app.get("/login", (req, res) => {

  let user = users[req.session.user_id];
  let templateVars = {user};

//If user is already loggin in, redirect to URLS. If not, render login page.
  if (user !== undefined) {
    res.redirect("/urls");
  } else {
    res.render("login", templateVars);
  }
});


app.get("/u/:shortURL", (req,res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.send("<a href ='/'><h2 style='text-align:center'>The requested link does not exist!</h2></a>");
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req,res) => {
  let user = users[req.session.user_id];

  if (user && user.id === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.send('Not permitted to delete this URL!');
  }
});

app.post("/urls/:shortURL/edit", (req,res) => {
  let user = users[req.session.user_id];

  if (user && user.id === urlDatabase[req.params.shortURL].userID) {
    res.redirect("/urls/" + req.params.shortURL);
  } else {
    res.send('<h2>Not permitted to edit this URL!\n<h2>');
  }
});

app.post("/urls/:shortURL/editURL", (req,res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.newURL;
  res.redirect("/urls/" + req.params.shortURL);
});

app.post("/urls", (req, res) => {
  let random = generateRandomString();
  let userID = req.session.user_id;
  let date = new Date();
  let dateString = date.toString().slice(0,15);

  urlDatabase[random] = {
    longURL: req.body.longURL,
    userID,
    date : dateString
  };

  res.redirect(`/urls/${random}`);
});

app.post("/loginUser", (req,res) => {
  let user = getUserByEmail(req.body.email, users);
  if (user !== undefined && bcrypt.compareSync(req.body.password, users[user].password)) {

    req.session.user_id = user;
    res.redirect("/urls");

  } else {
    res.send("Incorrect email/password!");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/');
});

app.post("/register", (req,res) => {
  let user = getUserByEmail(req.body.email, users);
  //If user does not exist, then user === undefined
  if (user !== undefined) {
    res.status(400);
    res.send('Email already registered!');
  }
// Checks if email or password being registered is an empty string
  checkEmptyEmails(req, res);

  let hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: hashedPassword
  };

  res.redirect('/login');
});


