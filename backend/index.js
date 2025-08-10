import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
// Import Mongoose model
import Question from "./models/Question.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }
};
connectDB();

// POST /api/questions - Save a new question
app.post("/api/questions", async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/questions - Get all questions
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/questions/:id - Get specific question
app.get("/api/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(question);
  } catch (error) {
    res.status(400).json({ error: "Invalid question ID" });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy" });
});

// DELETE all questions
app.delete("/api/questions", async (req, res) => {
  try {
    await Question.deleteMany({});
    res.status(200).json({ message: "All questions deleted successfully" });
  } catch (err) {
    console.error("Error deleting questions:", err);
    res.status(500).json({ error: "Failed to delete questions" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
