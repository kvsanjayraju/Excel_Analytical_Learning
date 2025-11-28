import { Link } from 'react-router-dom';
import { useCourseStore } from '../store/useCourseStore';
import { CheckCircle, Lock } from 'lucide-react';
import { clsx } from 'clsx';
import type { Lesson } from '../types/lesson';
import lesson1Data from '../lessons/data/lesson1.json';
import lesson2Data from '../lessons/data/lesson2.json';

// Simple manual registry for now
const lessons: Lesson[] = [
    lesson1Data as unknown as Lesson,
    lesson2Data as unknown as Lesson
];

export const CourseMap = () => {
  const { completedLessons } = useCourseStore();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Course Map</h1>
            <p className="text-slate-600">Your journey from grid novice to spreadsheet architect.</p>
        </div>

        <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 -ml-0.5 z-0" />

            <div className="space-y-12 relative z-10">
                {lessons.map((lesson, index) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    // Determine if unlocked: first lesson is always unlocked,
                    // others unlocked if previous is completed.
                    const isUnlocked = index === 0 || completedLessons.includes(lessons[index - 1].id);

                    return (
                        <Link
                            to={isUnlocked ? `/lesson/${lesson.id}` : '#'}
                            key={lesson.id}
                            className={clsx(
                                "block bg-white p-6 rounded-2xl border-2 transition-all text-center relative hover:scale-105 transform duration-200",
                                isCompleted ? "border-green-500 shadow-green-100" : (isUnlocked ? "border-blue-500 shadow-blue-100 hover:shadow-xl" : "border-slate-200 opacity-70 cursor-not-allowed")
                            )}
                        >
                            <div className={clsx(
                                "absolute -top-4 left-1/2 -ml-4 w-8 h-8 rounded-full border-4 flex items-center justify-center bg-white",
                                isCompleted ? "border-green-500 text-green-500" : (isUnlocked ? "border-blue-500 text-blue-500" : "border-slate-300 text-slate-300")
                            )}>
                                {isCompleted ? <CheckCircle size={16} /> : (isUnlocked ? <div className="w-2 h-2 bg-blue-500 rounded-full" /> : <Lock size={14} />)}
                            </div>

                            <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                            <p className="text-slate-500 text-sm">{lesson.description}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};
