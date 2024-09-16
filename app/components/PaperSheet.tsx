"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';

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
  const [saveError, setSaveError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [storyId, setStoryId] = useState<string | null>(null);
  const [storyNumber, setStoryNumber] = useState<number | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isThinkingTitle, setIsThinkingTitle] = useState(false);
  const [thinkingText, setThinkingText] = useState('');
  const [isErasingThinkingText, setIsErasingThinkingText] = useState(false);
  const [isTypingTitle, setIsTypingTitle] = useState(false);

  const scrollToBottom = () => {
    if (storyRef.current) {
      storyRef.current.scrollTop = storyRef.current.scrollHeight;
    }
  };

  const scrollToTop = () => {
    if (storyRef.current) {
      storyRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

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

  useEffect(() => {
    if (isGenerating) {
      scrollToBottom();
    }
  }, [story]);

  useEffect(() => {
    if (isStoryComplete && story) {
      scrollToTop();
      setIsThinkingTitle(true);
      setTimeout(() => {
        setIsThinkingTitle(false);
        generateTitleAndSaveStory(story);
      }, 2000);
    }
  }, [isStoryComplete, story]);

  useEffect(() => {
    if (!isThinkingTitle && thinkingText) {
      setIsErasingThinkingText(true);
      const intervalId = setInterval(() => {
        setThinkingText(prev => prev.slice(0, -1));
        if (thinkingText.length === 0) {
          clearInterval(intervalId);
          setIsErasingThinkingText(false);
        }
      }, 20);
      return () => clearInterval(intervalId);
    }
  }, [isThinkingTitle, thinkingText]);

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

  const generateTitleAndSaveStory = async (storyContent: string) => {
    if (!storyContent || storyContent.trim().length === 0) {
      console.error('Cannot save empty story');
      setSaveError('Не удалось сохранить пустую историю. Пожалуйста, попробуйте еще раз.');
      return;
    }

    try {
      // Анимация "Придумываю название..."
      setIsThinkingTitle(true);
      setThinkingText(''); // Сбрасываем текст перед анимацией
      for (let i = 0; i <= "Придумываю название...".length; i++) {
        setThinkingText("Придумываю название...".slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 20)); // Ускоренная анимация
      }

      // Генерация названия
      console.log('Generating title for story...');
      let generatedTitle = 'Без названия';
      try {
        const titleResponse = await fetch('/api/generateTitle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ story: storyContent }),
        });
        if (titleResponse.ok) {
          const titleData = await titleResponse.json();
          generatedTitle = titleData.title;
          console.log('Generated title:', generatedTitle);
        } else {
          console.error('Failed to generate title:', await titleResponse.text());
        }
      } catch (titleError) {
        console.error('Error during title generation:', titleError);
      }

      // Анимация стирания "Придумываю название..."
      setIsThinkingTitle(false);
      setIsErasingThinkingText(true);
      for (let i = "Придумываю название...".length; i >= 0; i--) {
        setThinkingText("Придумываю название...".slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 20)); // Ускоренная анимация
      }
      setIsErasingThinkingText(false);

      // Анимация печати нового названия
      setIsTypingTitle(true);
      setTitle('');
      for (let i = 0; i <= generatedTitle.length; i++) {
        setTitle(generatedTitle.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 30)); // Ускоренная анимация
      }
      setIsTypingTitle(false);

      // Сохранение истории
      setIsSaving(true);
      console.log('Saving story:', { title: generatedTitle, contentLength: storyContent.length, prompt, model: 'mistralai/pixtral-12b:free' });
      const saveResponse = await fetch('/api/saveStory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: generatedTitle, content: storyContent, prompt, model: 'mistralai/pixtral-12b:free' }),
      });

      if (saveResponse.ok) {
        const { id, number } = await saveResponse.json();
        console.log('Story saved successfully:', { id, number });
        setStoryId(id);
        setStoryNumber(number);
        setShareUrl(`${window.location.origin}/story/${id}`);
        setSaveError(null);
      } else {
        const errorText = await saveResponse.text();
        console.error('Failed to save story:', errorText);
        throw new Error(errorText);
      }
    } catch (error) {
      console.error('Error saving story:', error);
      setSaveError(`Не удалось сохранить историю. Пожалуйста, попробуйте еще раз. Ошибка: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
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
    setSaveError(null);
    setStoryId(null);
    setStoryNumber(null);
    setShareUrl(null);
    setTitle(null);
    setIsSaving(false);
    setIsThinkingTitle(false);
    setClearingText(false);
    setClearPosition(0);
    onNewStory();
  };

  const renderCursor = () => (
    <motion.span
      animate={{ opacity: [0, 1, 0] }}
      transition={{ repeat: Infinity, duration: 1 }}
      className="inline-block w-2 h-5 bg-blue-500 ml-1 align-middle"
    />
  );

  return (
    <div className="flex flex-col items-center relative">
      <div className="w-full mb-4 flex justify-end items-center font-system">
        <AnimatePresence>
          {shareUrl && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-grow mr-2 p-4 bg-gray-100 rounded-lg flex items-center"
            >
              {isSaving ? (
                <span>Сохраняю...</span>
              ) : (
                <>
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-grow p-2 border rounded-l"
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
                  >
                    Копировать
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={handleNewStory}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600 transition-colors"
          title="Новая история"
        >
          <FiRefreshCw className="mr-2" />
          Заново
        </button>
      </div>
      
      {shareUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-4 text-xs text-gray-500 flex justify-between items-center font-system"
        >
          <span>#{storyNumber}</span>
          <span>{new Date().toLocaleString()}</span>
          <span>mistralai/pixtral-12b:free</span>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-lg shadow-lg p-8 relative overflow-hidden flex flex-col font-story"
        style={{ minHeight: '500px' }}
      >
        <AnimatePresence mode="wait">
          {(isThinkingTitle || isErasingThinkingText) && (
            <motion.h2
              key="thinking"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg mb-4 h-10" // Обычный шрифт для "Придумываю название..."
            >
              {thinkingText}
              {renderCursor()}
            </motion.h2>
          )}
          {title && !isThinkingTitle && !isErasingThinkingText && (
            <motion.h2
              key="title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold mb-4 h-10" // Жирный шрифт для названия
            >
              {title}
              {isTypingTitle && renderCursor()}
            </motion.h2>
          )}
        </AnimatePresence>
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
                  <>
                    {clearingText ? inputValue : story}
                    {(clearingText || (isGenerating && !isStoryComplete)) && renderCursor()}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}