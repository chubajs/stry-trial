"use client";

import { useState } from 'react';
import StoryForm from "./components/StoryForm";
import StoryDisplay from "./components/StoryDisplay";
import PaperSheet from "./components/PaperSheet";

export default function Home() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStorySubmit = (prompt: string) => {
    setCurrentPrompt(prompt);
    setIsGenerating(true);
  };

  const handleNewStory = () => {
    setCurrentPrompt('');
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen p-8 pb-20 flex flex-col items-center justify-center gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          Персонализированный генератор историй
        </h1>
        <p className="text-xl mb-8">Создайте уникальную историю в один клик!</p>
      </header>

      <main className="w-full max-w-2xl">
        <PaperSheet
          onSubmit={handleStorySubmit}
          prompt={currentPrompt}
          isGenerating={isGenerating}
          onNewStory={handleNewStory}
        />
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
