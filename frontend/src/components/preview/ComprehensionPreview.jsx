import React, { useState } from "react";

const ComprehensionPreview = ({ questionData, onAnswer, userAnswer }) => {
  const { passage, questions } = questionData.data;
  const [selectedAnswers, setSelectedAnswers] = useState(userAnswer || {});

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newAnswers = {
      ...selectedAnswers,
      [questionIndex]: optionIndex,
    };
    setSelectedAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  return (
    <div className="space-y-6">
      {/* Passage */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-3">Passage:</h4>
        <p className="text-gray-800 leading-relaxed">{passage}</p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <h4 className="font-semibold">Questions:</h4>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="p-4 border rounded-lg">
            <p className="font-medium mb-3">
              {qIndex + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((option, oIndex) => (
                <label
                  key={oIndex}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    value={oIndex}
                    checked={selectedAnswers[qIndex] === oIndex}
                    onChange={() => handleAnswerSelect(qIndex, oIndex)}
                    className="text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComprehensionPreview;
