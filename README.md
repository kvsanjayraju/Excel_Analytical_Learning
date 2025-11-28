# Excel Analytical Learning

## Overview

A "Brilliant.org for Excel" learning platform built with React, TypeScript, and Tailwind CSS. The goal is to teach Excel concepts interactively, peeling back the layers of how spreadsheets work under the hood.

## Tech Stack

- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS (v4)
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Routing:** React Router DOM

## Project Structure

- `src/components`: Reusable UI components (Grid, LessonPlayer, etc.)
- `src/pages`: Top-level pages (Landing, Map, Lesson, Playground)
- `src/lessons/data`: JSON files defining lesson content
- `src/store`: Global state (course progress)
- `src/lib`: Utility functions (spreadsheet logic)
- `src/types`: TypeScript definitions

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  **Build for production:**
    ```bash
    npm run build
    ```

## Adding New Lessons

1.  Create a new JSON file in `src/lessons/data/` (e.g., `lesson3.json`).
2.  Follow the schema defined in `src/types/lesson.ts`.
3.  Import the JSON file in `src/pages/CourseMap.tsx` and `src/pages/LessonPage.tsx` and add it to the `lessons` registry.

## Developer Notes

- The grid engine is simplified for educational purposes. It supports basic arithmetic and referencing (A1 + B1).
- `eval()` is used for formula calculation in this demo version. For a production app, a proper parser/evaluator should be implemented.
