import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["categorize", "cloze", "comprehension"],
      required: true,
    },
    data: {
      type: Object, // Stores the question's full JSON
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", QuestionSchema);
// questions
