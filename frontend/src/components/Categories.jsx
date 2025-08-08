import React, { useState } from "react";

function Categories() {
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState([]);

  const [itemInput, setItemInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [items, setItems] = useState([]);
  // items - { name: string, category: string }

  const handleAddCategory = () => {
    if (categoryInput.trim() && !categories.includes(categoryInput)) {
      setCategories([...categories, categoryInput.trim()]);
      setCategoryInput("");
    }
  };

  const handleAddItem = () => {
    if (itemInput.trim() && selectedCategory) {
      setItems([
        ...items,
        { name: itemInput.trim(), category: selectedCategory },
      ]);
      setItemInput("");
      setSelectedCategory("");
    }
  };

  const handleRemoveCategory = (cat) => {
    setCategories(categories.filter((c) => c !== cat));
    setItems(items.filter((item) => item.category !== cat));
  };

  return (
    <div className="max-w-xl w-full mx-auto p-6 bg-[hsl(0,0%,85%)] text-black rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-center">
        Categorize Question Builder
      </h2>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-medium mb-2">Categories</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 text-sm"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            placeholder="Enter category"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddCategory();
              }
            }}
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Add
          </button>
        </div>
        <ul className="space-y-1">
          {categories.map((cat, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded text-sm"
            >
              {cat}
              <button
                onClick={() => handleRemoveCategory(cat)}
                className="text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Items */}
      <div>
        <h3 className="text-lg font-medium mb-2">Items</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 text-sm"
            value={itemInput}
            onChange={(e) => setItemInput(e.target.value)}
            placeholder="Enter item"
          />
          <select
            className="border rounded px-2 py-2 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddItem}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
          >
            Add
          </button>
        </div>
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li
              key={index}
              className="bg-gray-50 border rounded px-3 py-2 text-sm flex justify-between"
            >
              <span>{item.name}</span>
              <span className="text-gray-500 italic">{item.category}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Preview */}
      <div>
        <h3 className="text-lg font-medium mb-2">Preview</h3>
        <div className="space-y-4">
          {categories.map((cat, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded">
              <h4 className="font-semibold text-sm mb-1">{cat}</h4>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {items
                  .filter((item) => item.category === cat)
                  .map((item, idx) => (
                    <li key={idx}>{item.name}</li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
