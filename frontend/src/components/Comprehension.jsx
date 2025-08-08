import React, { useState } from "react";

function Comprehension() {
  const [passage, setPassage] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctIndex: null },
  ]);
  // passage - string containing the text passage
  // questions - array of objects with question text, options, and correct answer index

  const handleQuestionChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectChange = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].correctIndex = oIndex;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctIndex: null },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[hsl(0,0%,85%)] text-black rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-center">
        Comprehension Question Builder
      </h2>

      {/* Passage */}
      <div>
        <label className="block mb-1 font-medium">Passage</label>
        <textarea
          rows={5}
          className="w-full border rounded px-3 py-2 text-sm"
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
          placeholder="Enter the passage text here..."
        />
      </div>

      {/* Questions */}
      <div>
        <h3 className="text-lg font-medium mb-2">MCQ Questions</h3>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border rounded p-4 mb-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <label className="font-medium">Question {qIndex + 1}</label>
              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm mb-3"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              placeholder="Enter question text"
            />

            {/* Options */}
            <div className="space-y-2">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctIndex === oIndex}
                    onChange={() => handleCorrectChange(qIndex, oIndex)}
                  />
                  <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2 text-sm"
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                    placeholder={`Option ${oIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Add Another Question
        </button>
      </div>

      {/* Preview */}
      {passage && (
        <div>
          <h3 className="text-lg font-medium mb-2">Preview</h3>
          <div className="bg-gray-100 p-4 rounded space-y-4">
            <p className="text-gray-800">{passage}</p>
            {questions.map((q, i) => (
              <div key={i} className="space-y-1">
                <p className="font-medium">
                  {i + 1}. {q.question}
                </p>
                <ul className="list-disc pl-5">
                  {q.options.map((opt, idx) => (
                    <li
                      key={idx}
                      className={
                        q.correctIndex === idx
                          ? "text-green-700 font-semibold"
                          : ""
                      }
                    >
                      {opt || "..."}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Comprehension;
