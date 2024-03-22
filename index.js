const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// List of swear words to censor
const swearWords = [
  "fuck",
  "shit",
  "asshole",
  "bitch",
  "bastard",
  "dick",
  "cunt",
  "motherfucker",
  "cock",
  "twat",
  "piss",
  "bullshit",
  // Add more words as needed
];

// Function to censor swear words
const censorSwearWords = (text) => {
  for (const word of swearWords) {
    const regex = new RegExp(`\\b${word}\\b`, "gi"); // Case insensitive whole word match
    text = text.replace(regex, "*".repeat(word.length));
  }
  return text;
};

let messages = [];

// Function to check if username contains swear words
const isUsernameValid = (username) => {
  for (const word of swearWords) {
    const regex = new RegExp(`\\b${word}\\b`, "i"); // Case insensitive whole word match
    if (regex.test(username)) {
      return false;
    }
  }
  return true;
};

app.get("/messages", (req, res) => {
  const reversedMessages = messages.slice(-20).reverse();
  res.json(reversedMessages);
});

app.post("/messages", (req, res) => {
  const { username, message } = req.body;
  if (!username || !message) {
    return res.status(400).json({ error: "Username and message are required" });
  }
  if (username.length > 20) {
    return res
      .status(400)
      .json({ error: "Username must be at most 20 characters" });
  }
  if (!isUsernameValid(username)) {
    return res.status(400).json({ error: "Invalid username" });
  }
  if (message.length > 200) {
    return res
      .status(400)
      .json({ error: "Message must be at most 200 characters" });
  }
  const censoredMessage = censorSwearWords(message); // Censor swear words
  const newMessage = { username, message: censoredMessage };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
