const checkEmptyEmails = function(req, res) {

  if (req.body.email === '' || req.body.password === '') {
    res.status(404);
    res.send('Invalid email or password!');
    // return true;
  }
}

const getUserByEmail = function(email, Users) {
  for (let user in Users) {
    if (email === Users[user].email) {
      return user;
    }
  }
};

const generateRandomString = function() {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const urlsForUser = function(id, database) {

  let userURLs = {};
  
  for (let url in database) {
    if (database[url].userID === id) {
      userURLs[url] = {longURL: database[url].longURL, date : database[url].date};
    }
  }

  if (id === undefined) {
    userURLs = {}; // Resets userURLs after a user logs out and user_id cookie is cleared.
  }
  
  return userURLs;
};

module.exports = {checkEmptyEmails, getUserByEmail, generateRandomString, urlsForUser};