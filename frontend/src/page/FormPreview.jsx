import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constants/constants.js";
import CategorizePreview from "../components/preview/CategorizePreview.jsx";
import ClozePreview from "../components/preview/ClozePreview.jsx";
import ComprehensionPreview from "../components/preview/ComprehensionPreview.jsx";

function FormPreview() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/questions`);
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer,
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitForm = async () => {
    try {
      // Here you would typically send the answers to your backend
      const submissionData = {
        answers: userAnswers,
        completedAt: new Date().toISOString(),
      };

      console.log("Form submission:", submissionData);
      setSubmitted(true);
      alert("Form submitted successfully!");
    } catch (err) {
      alert(`Error submitting form: ${err.message}`);
    }
  };

  const renderQuestion = (question) => {
    const commonProps = {
      questionData: question,
      onAnswer: (answer) => handleAnswer(question._id, answer),
      userAnswer: userAnswers[question._id],
    };

    switch (question.type) {
      case "categorize":
        return <CategorizePreview {...commonProps} />;
      case "cloze":
        return <ClozePreview {...commonProps} />;
      case "comprehension":
        return <ComprehensionPreview {...commonProps} />;
      default:
        return <div>Unknown question type</div>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchQuestions}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Questions Found
          </h3>
          <p className="text-gray-600 mb-4">
            There are no questions available to preview.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-amber-600 text-white px-4 py-2 mt-4 rounded"
          >
            Create Questions
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-green-800 mb-2">
            Form Submitted Successfully!
          </h3>
          <p className="text-green-600 mb-6">
            Thank you for completing the form.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setCurrentQuestionIndex(0);
                setUserAnswers({});
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Take Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-amber-600 text-white px-4 py-2 mt-4 rounded"
            >
              Back to Builder
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Form Preview</h1>

        {/* Progress Text */}
        <p className="text-center text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      {/* Current Question */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize mb-2">
            {currentQuestion.type}
          </span>
          <h2 className="text-xl font-semibold">
            Question {currentQuestionIndex + 1}
          </h2>
        </div>

        {renderQuestion(currentQuestion)}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-6 py-2 rounded-lg font-medium ${
            currentQuestionIndex === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
        >
          Previous
        </button>

        <div className="text-center">
          <span className="text-gray-600">
            {Object.keys(userAnswers).length} of {questions.length} answered
          </span>
        </div>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={submitForm}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Submit Form
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Next
          </button>
        )}
      </div>

      {/* Question Overview */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">Question Overview</h3>
        <div className="flex flex-wrap gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium ${
                index === currentQuestionIndex
                  ? "bg-purple-600 text-white"
                  : userAnswers[questions[index]._id]
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
      >
        Build Form
      </button>
    </div>
  );
}

export default FormPreview;
