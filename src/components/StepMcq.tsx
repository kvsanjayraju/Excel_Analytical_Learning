import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { McqOption } from '../types/lesson';
import { clsx } from 'clsx';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface StepMcqProps {
  prompt: string;
  options: McqOption[];
  correctOptionId: string;
  explanation: string;
  onComplete: () => void;
}

export const StepMcq: React.FC<StepMcqProps> = ({ prompt, options, correctOptionId, explanation, onComplete }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    // Removed auto-advance logic
  };

  const isCorrect = selected === correctOptionId;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-800">{prompt}</h3>

      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => {
          const isSelected = selected === option.id;
          let variantClass = "border-slate-200 hover:border-slate-300 bg-white";

          if (submitted) {
            if (option.id === correctOptionId) variantClass = "border-green-500 bg-green-50";
            else if (isSelected) variantClass = "border-red-500 bg-red-50";
          } else if (isSelected) {
            variantClass = "border-blue-500 bg-blue-50";
          }

          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => !submitted && setSelected(option.id)}
              className={clsx(
                "p-4 border-2 rounded-xl text-left transition-colors flex items-center justify-between",
                variantClass
              )}
            >
              <span className="font-medium">{option.label}</span>
              {submitted && option.id === correctOptionId && <CheckCircle className="text-green-500" />}
              {submitted && isSelected && option.id !== correctOptionId && <XCircle className="text-red-500" />}
            </motion.button>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full py-3 px-6 bg-slate-900 text-white rounded-full font-semibold disabled:opacity-50 hover:bg-slate-800 transition-colors"
        >
          Check Answer
        </button>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={clsx("p-4 rounded-lg", isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}
        >
          <p className="font-bold mb-1">{isCorrect ? "Correct!" : "Not quite."}</p>
          <p>{explanation}</p>
          {!isCorrect && (
              <button onClick={() => { setSubmitted(false); setSelected(null); }} className="mt-2 text-sm underline">Try again</button>
          )}
        </motion.div>
      )}

      {submitted && isCorrect && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="pt-4"
          >
              <button
                onClick={onComplete}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-semibold"
              >
                Continue <ChevronRight size={20} />
              </button>
          </motion.div>
      )}
    </div>
  );
};
