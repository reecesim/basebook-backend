const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors package

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware

let messages = [];

app.get("/messages", (req, res) => {
  const reversedMessages = messages.slice(-20).reverse(); // Reverse the order of messages and return the last 20
  res.json(reversedMessages);
});

app.post("/messages", (req, res) => {
  const { username, message } = req.body;
  console.log(req.body);
  if (!username || !message) {
    return res.status(400).json({ error: "Username and message are required" });
  }
  if (message.length > 200) {
    return res
      .status(400)
      .json({ error: "Message must be at most 200 characters" });
  }
  const newMessage = { username, message };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
