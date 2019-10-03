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

module.exports = {checkEmptyEmails, getUserByEmail};