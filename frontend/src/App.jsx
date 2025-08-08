import React from "react";
import { useState } from "react";
import "./App.css";
import Categories from "./components/Categories";
import ClozeQuestion from "./components/Cloze";
import Comprehension from "./components/Comprehension";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h2 className="text-3xl font-bold text-center m-6">Form Builder</h2>
      <div className="px-40 w-full mb-20 mt-20 flex items-center justify-center ">
        <Categories />
        <ClozeQuestion />
      </div>
      <div className="mb-10">
        <Comprehension />
      </div>
    </>
  );
}

export default App;
