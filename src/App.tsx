import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CourseMap } from './pages/CourseMap';
import { LessonPage } from './pages/LessonPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { ExcelInspectorPage } from './pages/ExcelInspectorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<CourseMap />} />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/inspector" element={<ExcelInspectorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
