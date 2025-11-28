import React from 'react';
import type { Lesson } from '../types/lesson';
import { StepNarrative } from './StepNarrative';
import { StepMcq } from './StepMcq';
import { StepGridInteraction } from './StepGridInteraction';
import { ProgressBar } from './ProgressBar';
import { useCourseStore } from '../store/useCourseStore';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LessonPlayerProps {
  lesson: Lesson;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson }) => {
  const { currentStepIndex, nextStep, completeLesson } = useCourseStore();
  const navigate = useNavigate();

  const currentStep = lesson.steps[currentStepIndex];
  const isLastStep = currentStepIndex === lesson.steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeLesson();
      navigate('/map'); // Go back to map on completion
    } else {
      nextStep();
    }
  };

  const renderStep = () => {
    switch (currentStep.type) {
      case 'narrative':
        return (
          <div className="space-y-6">
            <StepNarrative text={currentStep.text} />
            <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
            >
                Continue <ChevronRight size={20} />
            </button>
          </div>
        );
      case 'mcq':
        return (
          <StepMcq
            prompt={currentStep.prompt}
            options={currentStep.options}
            correctOptionId={currentStep.correctOptionId}
            explanation={currentStep.explanation}
            onComplete={handleNext}
          />
        );
      case 'gridInteraction':
        return (
          <StepGridInteraction
            prompt={currentStep.prompt}
            initialGrid={currentStep.initialGrid}
            goalDescription={currentStep.goalDescription}
            expectedCells={currentStep.expectedCells}
            onComplete={handleNext}
          />
        );
      default:
        return <div>Unknown step type</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate('/map')} className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronLeft />
        </button>
        <div className="flex-1">
            <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>{lesson.title}</span>
                <span>{currentStepIndex + 1} / {lesson.steps.length}</span>
            </div>
            <ProgressBar current={currentStepIndex + 1} total={lesson.steps.length} />
        </div>
      </div>

      <div className="flex-1 grid md:grid-cols-2 gap-12">
        <div className="flex flex-col justify-center">
            {/* Left side content */}
            {renderStep()}
        </div>

        <div className="hidden md:flex items-center justify-center bg-slate-50 rounded-3xl p-8 border border-slate-100 relative overflow-hidden">
            {/* Right side visualization - Generic decorative grid or context-aware */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {/* If the step isn't a grid interaction, show a decorative grid or relevant illustration */}
            {currentStep.type !== 'gridInteraction' && (
                <div className="w-full max-w-sm aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-300">
                    {/* Placeholder for dynamic visualizations based on lesson context */}
                    <div className="text-center">
                        <div className="grid grid-cols-3 gap-2 p-4">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="w-12 h-12 bg-slate-100 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
