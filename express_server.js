const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}))

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

function checkEmails(req, res) {

  if (req.body.email === '' || req.body.password === '') {
    res.status(404);
    res.send('Invalid email or password!');
    return true;
  }

  for(let user in users) {
    if (req.body.email === users[user].email) {
      res.status(400);
      res.send('Email already registered!');
      return true;
    }
  }

  return false;
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World<b></body></html>\n");
});

app.get("/urls", (req,res) => {
  let templateVars = {urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req,res) => {
  let templateVars = {username: req.cookies["username"]}
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req,res) => {
  let templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]};
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {username: req.cookies["username"]}
  res.render("register_user", templateVars);
});

app.get("/u/:shortURL", (req,res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});


app.post("/urls/:shortURL/delete", (req,res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");

});

app.post("/urls/:shortURL/edit", (req,res) => {
  res.redirect("/urls/" + req.params.shortURL);
});

app.post("/urls/:shortURL/editURL", (req,res) => {
  urlDatabase[req.params.shortURL] = req.body.newURL;
  res.redirect("/urls/" + req.params.shortURL)
});

app.post("/urls", (req, res) => {
  let random = generateRandomString()
  urlDatabase[random] = req.body.longURL;
  res.redirect(`/urls/${random}`);
});

app.post("/login", (req,res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
  // console.log(req.body);
})

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
})

app.post("/register", (req,res) => {

  if (checkEmails(req, res)) {
    return;
  };

  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: req.body.password
  }

  res.cookie('user_id', userId);
  res.redirect('/urls');

  
})




