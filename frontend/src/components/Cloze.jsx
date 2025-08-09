import React, { useState } from "react";
import { BACKEND_URL } from "../constants/constants.js";

function ClozeQuestion() {
  const [sentence, setSentence] = useState("");
  const [blankCount, setBlankCount] = useState(0);
  const [answers, setAnswers] = useState([]);
  // sentence - string
  // blankCount - number
  // answers - array of strings

  const handleSentenceChange = (e) => {
    const text = e.target.value;
    setSentence(text);

    const count = (text.match(/_/g) || []).length;
    setBlankCount(count);
    setAnswers(Array(count).fill(""));
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const getPreview = () => {
    let parts = sentence.split("_");
    let preview = [];
    for (let i = 0; i < parts.length; i++) {
      preview.push(<span key={`text-${i}`}>{parts[i]}</span>);
      if (i < answers.length) {
        preview.push(
          <span
            key={`ans-${i}`}
            className="font-semibold text-green-700 underline mx-1"
          >
            {answers[i] || "____"}
          </span>
        );
      }
    }
    return preview;
  };

  const saveQuestion = async () => {
    if (!sentence.trim()) {
      alert("Please enter a sentence.");
      return;
    }
    if (blankCount === 0) {
      alert("Sentence must contain at least one '_' for a blank.");
      return;
    }
    if (answers.some((a) => !a.trim())) {
      alert("Please fill in all answers.");
      return;
    }
    const questionData = {
      type: "cloze",
      data: {
        sentence,
        blankCount,
        answers,
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
      alert("Question saved successfully!");
      console.log("Saved question:", saved);
      setSentence("");
      setAnswers([]);
      setBlankCount(0);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-xl w-full text-black mx-auto p-6 bg-[hsl(0,0%,85%)] rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-center">
        Cloze Question Builder
      </h2>

      {/* Sentence input */}
      <div>
        <label className="block mb-1 font-medium">
          Sentence (use "_" for blanks)
        </label>
        <textarea
          rows={3}
          className="w-full border rounded px-3 py-2 text-sm"
          value={sentence}
          onChange={handleSentenceChange}
          placeholder="Example: The capital of France is _ and the currency is _."
        />
        <p className="text-sm text-gray-500 mt-1">
          Number of blanks detected: <strong>{blankCount}</strong>
        </p>
      </div>

      {/* Answer inputs */}
      {blankCount > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Answers</h3>
          <div className="space-y-2">
            {answers.map((ans, index) => (
              <div key={index} className="flex items-center gap-2">
                <label className="text-sm w-20">Blank {index + 1}:</label>
                <input
                  type="text"
                  className="flex-1 border rounded px-3 py-2 text-sm"
                  value={ans}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder={`Answer for blank ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      {blankCount > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Preview</h3>
          <div className="bg-gray-100 p-3 rounded text-sm text-gray-800 leading-relaxed">
            {getPreview()}
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={saveQuestion}
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
      >
        Save Question
      </button>
    </div>
  );
}

export default ClozeQuestion;
