import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import FormPreview from "./page/FormPreview";
import FormBuilder from "./page/FormBuilder";

function App() {
  return (
    <Router basename="/Form-Builder">
      <Routes>
        <Route path="/" element={<FormBuilder />} />
        <Route path="/preview" element={<FormPreview />} />
      </Routes>
    </Router>
  );
}

export default App;
