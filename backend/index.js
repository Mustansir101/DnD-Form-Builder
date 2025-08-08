

// Build REST API endpoints:
// POST /api/forms - Create form
// GET /api/forms - List forms
// GET /api/forms/:id - Get specific form
// PUT /api/forms/:id - Update form
// POST /api/forms/:id/responses - Submit response
// GET /api/forms/:id/responses - Get responses

// server.js - minimal setup
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/formbuilder');

app.listen(5000, () => console.log('Server running on 5000'));