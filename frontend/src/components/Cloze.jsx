import React, { useState, useEffect } from "react";

function ClozeQuestion() {
  const [sentence, setSentence] = useState("");
  const [blankCount, setBlankCount] = useState(0);
  const [answers, setAnswers] = useState([]);
  // answers - array of strings corresponding to each blank
  // blankCount - number of blanks in the sentence
  // sentence - string with "_"

  useEffect(() => {
    const count = (sentence.match(/_/g) || []).length;
    setBlankCount(count);
    setAnswers(Array(count).fill("")); // reset answers when sentence changes
  }, [sentence]);

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
          onChange={(e) => setSentence(e.target.value)}
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
    </div>
  );
}

export default ClozeQuestion;
