import React, { useState } from "react";

export default function ComprehensionQuestion() {
  const [passage, setPassage] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", ""], correctAnswer: 0 },
    ]);
  };

  const updateQuestionText = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const setCorrectAnswer = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const saveQuestion = async () => {
    if (!passage.trim()) {
      alert("Please enter a passage.");
      return;
    } if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        alert(`Question ${i + 1} is missing text.`);
        return;
      } if (q.options.length < 2) {
        alert(`Question ${i + 1} must have at least two options.`);
        return;
      } if (q.options.some((opt) => !opt.trim())) {
        alert(`All options for question ${i + 1} must be filled.`);
        return;
      } if (q.correctAnswer === null || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        alert(`Please select a correct answer for question ${i + 1}.`);
        return;
      }
    }
    const questionData = {
      type: "comprehension",
      data: {
        passage,
        questions,
      },
    };
    try {
      const res = await fetch(`${BACKEND_URL}/api/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save question");
      }

      const saved = await res.json();
      alert("✅ Question saved successfully!");
      console.log("Saved question:", saved);

      // Reset
      setPassage("");
      setQuestions([]);
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Comprehension Question</h2>

      {/* Passage Input */}
      <textarea
        className="border p-2 w-full mb-4"
        placeholder="Enter passage"
        value={passage}
        onChange={(e) => setPassage(e.target.value)}
      />

      {/* Questions List */}
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6 border p-4 rounded">
          <input
            className="border p-2 w-full mb-2"
            placeholder={`Question ${qIndex + 1}`}
            value={q.questionText}
            onChange={(e) => updateQuestionText(qIndex, e.target.value)}
          />

          {q.options.map((opt, optIndex) => (
            <div key={optIndex} className="flex items-center mb-2">
              <input
                type="radio"
                name={`correct-${qIndex}`}
                checked={q.correctAnswer === optIndex}
                onChange={() => setCorrectAnswer(qIndex, optIndex)}
                className="mr-2"
              />
              <input
                className="border p-2 flex-1"
                placeholder={`Option ${optIndex + 1}`}
                value={opt}
                onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
              />
            </div>
          ))}

          <button
            onClick={() => addOption(qIndex)}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            + Add Option
          </button>
        </div>
      ))}

      {/* Add Question Button */}
      <button
        onClick={addQuestion}
        className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
      >
        + Add Question
      </button>

      {/* Save Button */}
      <button
        onClick={saveQuestion}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Question
      </button>
    </div>
  );
}
