const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log("Mongo Error:", err.message));

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
  res.send("StudyBuddy Running Successfully! Your AI Study Partner is Ready!");
});

// StudyBuddy AI Route
app.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(question);
    const answer = result.response.text();
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`StudyBuddy Server Running on http://localhost:${PORT}`);
});