"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaperSheetProps {
  onSubmit: (prompt: string) => void;
  prompt: string;
  isGenerating: boolean;
  onNewStory: () => void;
}

export default function PaperSheet({ onSubmit, prompt, isGenerating, onNewStory }: PaperSheetProps) {
  const [inputValue, setInputValue] = useState('');
  const [story, setStory] = useState('');
  const [isStoryComplete, setIsStoryComplete] = useState(false);
  const [clearingText, setClearingText] = useState(false);
  const [clearPosition, setClearPosition] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prompt && isGenerating) {
      setClearingText(true);
      setClearPosition(inputValue.length);
      setError(null);
    }
  }, [prompt, isGenerating]);

  useEffect(() => {
    if (clearingText) {
      const timer = setTimeout(() => {
        if (clearPosition > 0) {
          setClearPosition(clearPosition - 1);
          setInputValue(inputValue.slice(0, clearPosition - 1));
        } else {
          setClearingText(false);
          setStory('');
          setIsStoryComplete(false);
          generateStory();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [clearingText, clearPosition, inputValue]);

  const generateStory = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 секунд таймаут

      const response = await fetch('/api/generateStory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setIsStoryComplete(true);
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsStoryComplete(true);
              break;
            }
            try {
              const parsed = JSON.parse(data);
              const newToken = parsed.choices[0]?.delta?.content || '';
              if (newToken) {
                setStory(prev => prev + newToken);
              }
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Превышено время ожидания. Пожалуйста, попробуйте еще раз.');
        } else {
          setError('Произошла ошибка при генерации истории. Пожалуйста, попробуйте еще раз.');
        }
      } else {
        setError('Произошла неизвестная ошибка. Пожалуйста, попробуйте еще раз.');
      }
      setIsStoryComplete(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewStory = () => {
    setInputValue('');
    setStory('');
    setIsStoryComplete(false);
    setError(null);
    onNewStory();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-lg shadow-lg p-8 relative overflow-hidden flex flex-col"
      style={{ minHeight: '500px' }}
    >
      <form onSubmit={handleSubmit} className="flex-grow relative">
        {!isGenerating && !story && !error && (
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напишите вашу идею для истории здесь..."
            className="w-full h-full resize-none border-none outline-none text-lg"
          />
        )}
        <AnimatePresence>
          {(clearingText || isGenerating || story || error) && (
            <motion.div
              ref={storyRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full overflow-y-auto whitespace-pre-wrap text-lg text-black"
            >
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                clearingText ? inputValue : story
              )}
              {(clearingText || (isGenerating && !isStoryComplete)) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="inline-block w-2 h-5 bg-blue-500 ml-1 align-middle"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      {(isStoryComplete || error) && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleNewStory}
          className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {error ? 'Попробовать снова' : 'Новая история'}
        </motion.button>
      )}
    </motion.div>
  );
}