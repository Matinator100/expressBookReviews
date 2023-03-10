const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let user = users.filter(user => user.username === username)
  if(user.length){
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
  if (!req.body.username || !req.body.password) {
      return res.status(404).json({message: "Please enter valid credentials"});
  }
  else if(!authenticatedUser(req.body.username, req.body.password)){
      return res.status(404).json({message: "No Customer with specified credentials found"});
  }
  let accessToken = jwt.sign({
      data: {username: req.body.username, password: req.body.password}
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken
  }
  return res.status(200).json({message:"Customer successfully logged in"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.query.review;
  if(review){
    books[req.params.isbn].reviews[req.user.data.username] = review
    return res.status(200).json({message: `The review for book with ISBN ${req.params.isbn} has been added/updated`})
  }
  return res.status(404).json({message: "No review provided"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  delete books[req.params.isbn].reviews[req.user.data.username]
  return res.status(200).json({message : `Reviews for the book with ISBN ${req.params.isbn} posted by ${req.user.data.username} has been deleted`})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
