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
};

function generateRandomString() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

function urlsForUser(id, database) {

  let userURLs = {};
  
  for (let url in database) {
    if (database[url].userID === id) {
      userURLs[url] = database[url].longURL;
    } 
  }

  if (id === undefined) {
    userURLs = {}; // Resets userURLs after a user logs out and user_id cookie is cleared. 
  }
  
  return userURLs;
};

module.exports = {checkEmptyEmails, getUserByEmail, generateRandomString, urlsForUser};