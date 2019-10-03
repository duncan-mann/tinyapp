const express = require("express");
const bodyParser = require("body-parser");
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
// app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name : 'user_id',
  keys: ['id']
}));

const users = {};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function checkEmptyEmails(req, res) {

  if (req.body.email === '' || req.body.password === '') {
    res.status(404);
    res.send('Invalid email or password!');
    // return true;
  };
};

function getUserByEmail(email, Users) {
  for (user in Users) {
    if (email === Users[user].email) {
      return user;
    }
  }
}


function urlsForUser(id) {

  let userURLs = {};
  
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      userURLs[url] = urlDatabase[url].longURL;
    } 
  }

  if (id === undefined) {
    userURLs = {}; // Resets userURLs after a user logs out and user_id cookie is cleared. 
  }
  
  return userURLs;
};

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req,res) => {
  let user_id = req.session.user_id;
  let user = users[user_id];

  // Redirect user to login page if not logged in
  if (user === undefined) {
    res.redirect("/login");
  } 
  //Use urlsForUser to create object full of URLs created by that specific user.
  let userURLs = urlsForUser(user_id);

  let templateVars = {urls: userURLs, user};
  res.render("urls_index", templateVars);

});

app.get("/urls/new", (req,res) => {
  let user = users[req.session.user_id];

  if (user === undefined) {
    res.redirect("/login");
  } else {
  let templateVars = {user};
  res.render("urls_new", templateVars);
  };
});

app.get("/urls/:shortURL", (req,res) => {
  let user = users[req.session.user_id];
  let templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user};
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  let user = users[req.session.user_id];
  let templateVars = {user}
  res.render("register_user", templateVars);
});

app.get("/login", (req, res) => {
  let user = users[req.session.user_id];
  let templateVars = {user}
  res.render("login", templateVars);
});

app.get("/u/:shortURL", (req,res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL
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
  res.send('Not permitted to edit this URL!\n');
}
});

app.post("/urls/:shortURL/editURL", (req,res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.newURL;
  res.redirect("/urls/" + req.params.shortURL);
});

app.post("/urls", (req, res) => {
  let random = generateRandomString()
  let userID = req.session.user_id;

  urlDatabase[random] = {
    longURL: req.body.longURL,
    userID
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
  res.redirect('/urls');
});

app.post("/register", (req,res) => {
  let user = getUserByEmail(req.body.email, users);
   //If user does not exist, then user === undefined
  if (user !== undefined) {
    res.status(400);
    res.send('Email already registered!');
  }
  checkEmptyEmails(req, res);

  let hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: hashedPassword
  }
  res.redirect('/urls');

});


