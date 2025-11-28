import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LessonPlayer } from '../components/LessonPlayer';
import { useCourseStore } from '../store/useCourseStore';
import lesson1Data from '../lessons/data/lesson1.json';
import lesson2Data from '../lessons/data/lesson2.json';
import type { Lesson } from '../types/lesson';

const lessons: Record<string, Lesson> = {
    "1": lesson1Data as unknown as Lesson,
    "2": lesson2Data as unknown as Lesson
};

export const LessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const { startLesson } = useCourseStore();
  const navigate = useNavigate();

  const lesson = id ? lessons[id] : null;

  useEffect(() => {
    if (lesson) {
        startLesson(lesson.id);
    }
  }, [lesson, startLesson]);

  if (!lesson) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
            <button onClick={() => navigate('/map')} className="text-blue-600 hover:underline">Return to Map</button>
        </div>
    );
  }

  return <LessonPlayer lesson={lesson} />;
};
