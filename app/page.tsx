"use client";

import { useState } from 'react';
import StoryForm from "./components/StoryForm";
import StoryDisplay from "./components/StoryDisplay";

export default function Home() {
  const [currentPrompt, setCurrentPrompt] = useState('');

  const handleStorySubmit = (prompt: string) => {
    setCurrentPrompt(prompt);
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          Персонализированный генератор историй
        </h1>
        <p className="text-xl mb-8">Создайте уникальную историю в один клик!</p>
      </header>

      <main className="flex flex-col items-center justify-center">
        <StoryForm onSubmit={handleStorySubmit} />
        <StoryDisplay prompt={currentPrompt} />
      </main>
      
      <footer className="text-center py-4">
        <p>&copy; {new Date().getFullYear()} Sergey Bulaev. All rights reserved.</p>
        <a
          className="text-sm text-gray-600 hover:underline"
          href="https://t.me/sergiobulaev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow me on Telegram
        </a>
      </footer>
    </div>
  );
}
