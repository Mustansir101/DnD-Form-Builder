import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

const DraggableWord = ({ word, id, isUsed }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      data: { word },
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  if (isUsed) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`px-4 py-2 bg-purple-500 text-white rounded-lg cursor-move hover:bg-purple-600 transition-colors font-medium shadow-sm select-none ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {word}
    </div>
  );
};

// Droppable Blank Component
const DroppableBlank = ({ id, blankIndex, word, onRemove }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: { blankIndex },
  });

  return (
    <div
      ref={setNodeRef}
      className={`inline-block mx-2 min-w-[100px] min-h-[40px] border-2 border-dashed rounded-lg transition-colors relative ${
        isOver
          ? "border-blue-500 bg-blue-50"
          : "border-gray-400 bg-gray-100 hover:border-blue-400"
      }`}
    >
      {word ? (
        <div className="px-3 py-2 bg-purple-200 text-purple-800 rounded-lg m-1 flex items-center justify-between min-h-[32px]">
          <span className="font-medium">{word}</span>
          <button
            onClick={() => onRemove(blankIndex)}
            className="ml-2 text-purple-600 hover:text-purple-800 font-bold"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
          Drop here
        </div>
      )}
    </div>
  );
};

const ClozePreview = ({ questionData, onAnswer, userAnswer }) => {
  const { sentence, blankCount, answers } = questionData.data;
  const [userAnswers, setUserAnswers] = useState(
    userAnswer || Array(blankCount).fill("")
  );

  const [wordOptions] = useState(() => {
    const shuffled = [...answers].sort(() => Math.random() - 0.5);
    return shuffled;
  });

  const [activeWord, setActiveWord] = useState(null); // ✅ added to track dragged word

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    if (event.active.data.current?.word) {
      setActiveWord(event.active.data.current.word);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveWord(null); // ✅ reset after drop

    if (over && active.data.current?.word) {
      const word = active.data.current.word;
      const blankIndex = over.data.current?.blankIndex;

      if (blankIndex !== undefined) {
        const newAnswers = [...userAnswers];
        newAnswers[blankIndex] = word;
        setUserAnswers(newAnswers);
        onAnswer(newAnswers);
      }
    }
  };

  const handleRemoveWord = (blankIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[blankIndex] = "";
    setUserAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const renderSentenceWithBlanks = () => {
    const parts = sentence.split("_");
    let result = [];
    let blankIndex = 0;

    for (let i = 0; i < parts.length; i++) {
      result.push(<span key={`text-${i}`}>{parts[i]}</span>);

      if (i < parts.length - 1) {
        result.push(
          <DroppableBlank
            key={`blank-${blankIndex}`}
            id={`blank-${blankIndex}`}
            blankIndex={blankIndex}
            word={userAnswers[blankIndex]}
            onRemove={handleRemoveWord}
          />
        );
        blankIndex++;
      }
    }

    return result;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart} // ✅ added
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Word Options */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">
            Drag the words below to fill in the blanks:
          </h4>
          <div className="flex flex-wrap gap-2">
            {wordOptions.map((word, index) => (
              <DraggableWord
                key={`word-${index}`}
                id={`word-${index}`}
                word={word}
                isUsed={userAnswers.includes(word)}
                className="relative z-50" // ✅ ensure positioned + high z-index
              />
            ))}
          </div>
          {userAnswers.filter((answer) => answer).length ===
            wordOptions.length && (
            <p className="text-green-600 italic mt-2">
              All words have been used!
            </p>
          )}
        </div>

        {/* Sentence with Blanks */}
        <div className="p-6 bg-white border rounded-lg text-lg leading-relaxed">
          <div className="flex flex-wrap items-center gap-1">
            {renderSentenceWithBlanks()}
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Drag words from above into the blank spaces ({blankCount} blank
          {blankCount !== 1 ? "s" : ""} total)
        </p>
      </div>

      {/* ✅ Drag Overlay with high z-index */}
      <DragOverlay className="z-[9999] pointer-events-none">
        {activeWord ? (
          <div className="relative z-[9999] bg-white border rounded px-3 py-1 shadow-lg">
            {activeWord}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ClozePreview;
