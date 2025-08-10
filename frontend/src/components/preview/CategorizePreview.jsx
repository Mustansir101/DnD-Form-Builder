import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const DraggableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="px-3 py-2 bg-blue-100 rounded-lg cursor-move hover:bg-blue-200 transition-colors"
    >
      {children}
    </div>
  );
};

const DroppableCategory = ({ id, children, onDrop, items }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const style = {
    borderColor: isOver ? "#60a5fa" : "#d1d5db",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 border-2 border-dashed rounded-lg min-h-[100px] transition-colors"
    >
      <h4 className="font-semibold mb-2 text-center">{children}</h4>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="px-3 py-2 bg-green-100 rounded-lg flex justify-between items-center"
          >
            <span>{item.name}</span>
            <button
              onClick={() => onDrop(item.name, null)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Individual Question Components
const CategorizePreview = ({ questionData, onAnswer, userAnswer }) => {
  const { categories, items } = questionData.data;
  const [categorizedItems, setCategorizedItems] = useState(userAnswer || {});

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (over) {
      const newItems = {
        ...categorizedItems,
        [active.id]: over.id,
      };
      setCategorizedItems(newItems);
      onAnswer(newItems);
    }
  };

  const handleRemove = (itemName) => {
    const updated = { ...categorizedItems };
    delete updated[itemName];
    setCategorizedItems(updated);
    onAnswer(updated);
  };

  const getUncategorizedItems = () =>
    items.filter((item) => !categorizedItems[item.name]);

  const getItemsInCategory = (category) =>
    items.filter((item) => categorizedItems[item.name] === category);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* Uncategorized Items */}
      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <h4 className="font-semibold mb-2">Items to Categorize:</h4>
        <div className="flex flex-wrap gap-2">
          {getUncategorizedItems().map((item) => (
            <DraggableItem key={item.name} id={item.name}>
              {item.name}
            </DraggableItem>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <DroppableCategory
            key={category}
            id={category}
            items={getItemsInCategory(category)}
            onDrop={(itemName, newCategory) => {
              if (newCategory === null) {
                handleRemove(itemName);
              }
            }}
          >
            {category}
          </DroppableCategory>
        ))}
      </div>
    </DndContext>
  );
};

export default CategorizePreview;
