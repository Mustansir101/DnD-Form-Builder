import React from "react";
import { useNavigate } from "react-router-dom";
import Categories from "../components/builder/Categories.jsx";
import ClozeQuestion from "../components/builder/Cloze.jsx";
import Comprehension from "../components/builder/Comprehension.jsx";
import { BACKEND_URL } from "../constants/constants.js";

function FormBuilder() {
  const navigate = useNavigate();
  const handleClearQuestions = async () => {
    if (!window.confirm("Are you sure you want to delete all questions?"))
      return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/questions`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("All questions cleared!");
      } else {
        alert("Failed to clear questions");
      }
    } catch (err) {
      console.error(err);
      alert("Error clearing questions");
    }
  };

  return (
    <>
      <button
        onClick={handleClearQuestions}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Clear All Questions
      </button>
      <h2 className="text-3xl font-bold text-center m-6">Form Builder</h2>
      <div className="mb-10 flex flex-col items-center">
        <Categories />
        <br />
        <ClozeQuestion />
        <br />
        <Comprehension />
        <button
          onClick={() => navigate("/preview")}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        >
          Preview Form
        </button>
      </div>
    </>
  );
}

export default FormBuilder;
