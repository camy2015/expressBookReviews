const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  // Send JSON response with formatted list book data
  try {
    const result = JSON.stringify(books, null, 4);
    res.send(result);
  } catch (error) {
    res.send(`An error ocurred ${error.message}`);
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  // Retrieve the ISBN parameter from the request URL and send the corresponding Book's details
  const isbn = req.params.isbn;
  const book = await books[isbn];

  if (isbn in books) {
    res.send(book);
  } else {
    res.status(404).json({ message: `The isbn ${isbn} not exist` });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  // Retrieve the author parameter from the request URL and send the corresponding Book's details
  const author = req.params.author;
  const arrayBooks = Object.values(books);
  const findAuthor = arrayBooks.filter(
    (book) => book.author.toLocaleLowerCase() === author.toLocaleLowerCase()
  );

  if (findAuthor.length > 0) {
    res.send(findAuthor);
  } else {
    res.status(404).json(`The author ${author} not exist`);
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  // Retrieve the title parameter from the request URL and send the corresponding Book's details
  const title = req.params.title;
  const arrayBooks = Object.values(books);
  const findTitle = arrayBooks.filter(
    (book) => book.title.toLocaleLowerCase() === title.toLocaleLowerCase()
  );

  if (findTitle.length > 0) {
    res.send(findTitle);
  } else {
    res.status(404).json(`The title ${title} not exist`);
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  // Retrieve the ISBN parameter from the request URL and send the corresponding Book's review
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (isbn in books) {
    if (book.reviews.length > 0) {
      res.send(book);
    } else {
      res.status(404).send(`The book ${book.title} has no reviews`);
    }
  } else {
    res.status(404).json({ message: `The isbn ${isbn} not exist` });
  }
});

module.exports.general = public_users;
