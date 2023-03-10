const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  if(users.indexOf(username) >= 0){
    return false;
  }
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let userFound = false;
  for(let x = 0; x < users.length; x++){
    if (users[x].username === username && users[x].password === password){
      userFound = true;
      break;
    }
  }
  return userFound;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let user = req.body.user;
  if (!user) {
      return res.status(404).json({message: "Body Empty"});
  }
  else if(!authenticatedUser(user.username, user.password)){
      return res.status(404).json({message: "No user with specified credentials found"});
  }
  let accessToken = jwt.sign({
      data: user
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken
  }
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.body.review;
  if(review){
    books[req.params.isbn].reviews[req.user.data.username] = review
    return res.status(200).send(books[req.params.isbn])
  }
  return res.status(404).json({message: "No review provided"});
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  delete books[req.params.isbn].reviews[req.user.data.username]
  return res.status(200).send({message : "Review Deleted"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
