import React from 'react';

interface ScorePadProps {
  onScore: (runs: number) => void;
  onWicket: () => void;
  onExtra: (type: string, runs: number) => void;
  onUndo: () => void;
  onSwap: () => void;
}

const ScorePad: React.FC<ScorePadProps> = ({ onScore, onWicket, onExtra, onUndo, onSwap }) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      {/* Number Pad */}
      <div className="grid grid-cols-4 gap-3">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onScore(num)}
            className="h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-lg transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={onWicket}
          className="h-12 bg-danger text-white hover:bg-red-600 rounded-lg font-semibold transition-colors"
        >
          W
        </button>
      </div>

      {/* Extras */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onExtra('wide', 1)}
          className="py-2 bg-warning text-white hover:bg-yellow-600 rounded-lg font-medium transition-colors"
        >
          Wide
        </button>
        <button
          onClick={() => onExtra('noBall', 1)}
          className="py-2 bg-warning text-white hover:bg-yellow-600 rounded-lg font-medium transition-colors"
        >
          No Ball
        </button>
        <button
          onClick={() => onExtra('bye', 1)}
          className="py-2 bg-gray-500 text-white hover:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          Bye
        </button>
        <button
          onClick={() => onExtra('legBye', 1)}
          className="py-2 bg-gray-500 text-white hover:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          Leg Bye
        </button>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onUndo}
          className="py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg font-medium transition-colors"
        >
          Undo
        </button>
        <button
          onClick={onSwap}
          className="py-2 bg-primary text-white hover:bg-green-700 rounded-lg font-medium transition-colors"
        >
          Swap
        </button>
      </div>
    </div>
  );
};

export default ScorePad;