"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoryDisplay({ prompt }: { prompt: string }) {
  const [story, setStory] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (prompt) {
      setIsGenerating(true);
      setStory([]);
      generateStory();
    }
  }, [prompt]);

  const generateStory = async () => {
    const response = await fetch('/api/generateStory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.body) {
      console.error('No response body');
      setIsGenerating(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            setIsGenerating(false);
            break;
          }
          try {
            const parsed = JSON.parse(data);
            const newToken = parsed.choices[0]?.delta?.content || '';
            if (newToken) {
              setStory(prev => [...prev, newToken]);
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Ваша история:</h2>
      <div className="prose">
        <AnimatePresence>
          {story.map((token, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {token}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-gray-500"
        >
          Генерация истории...
        </motion.div>
      )}
    </motion.div>
  );
}