import React from 'react';
import { motion } from 'framer-motion';

// I will assume text is simple for now or install react-markdown later if needed.
// For now, I'll just render text in p tags.

interface StepNarrativeProps {
  text: string;
}

export const StepNarrative: React.FC<StepNarrativeProps> = ({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="prose prose-slate"
    >
      <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap">{text}</p>
    </motion.div>
  );
};
