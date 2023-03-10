const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register ustomer."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  return res.status(200).json({books : books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let book = books[req.params.isbn]
  if(book){
    return res.status(200).json(book)
  }
  return res.json({message: "No book with that ISBN found"});
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let authorBooks = Object.values(books).filter(book => book.author === req.params.author)
  return res.status(200).json({booksbyauthor: authorBooks});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let titleBooks = Object.values(books).filter(book => book.title === req.params.title)
  return res.status(200).json({booksbytitle: titleBooks});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let reviews= books[req.params.isbn].reviews;
  if(reviews){
    return res.send(reviews)
  }
  return res.json({message: "No book with that ISBN found"});
});

module.exports.general = public_users;
