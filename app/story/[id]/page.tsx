"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiShare2 } from 'react-icons/fi';

interface Story {
  id: string;
  title: string;
  content: string;
  model: string;
  createdAt: string;
  number: number;
  prompt: string;
}

export default function StoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    const fetchStory = async () => {
      try {
        console.log('Fetching story with id:', id);
        const response = await fetch(`/api/getStory/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Received story data:', data);
          setStory(data);
          setShareUrl(`${window.location.origin}/story/${id}`);
        } else {
          console.error('Failed to load story:', await response.text());
          setError('Failed to load story');
        }
      } catch (error) {
        console.error('An error occurred while fetching the story:', error);
        setError('An error occurred while fetching the story');
      }
    };

    if (id) {
      fetchStory();
    }
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    // Здесь можно добавить уведомление о успешном копировании
  };

  const handleCreateNewStory = () => {
    router.push('/');
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!story) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-between">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white bg-opacity-50 rounded-lg shadow-lg p-8 font-story"
        >
          <h1 className="text-2xl font-bold mb-4">{story.title}</h1>
          <div className="text-gray-700 mb-4 whitespace-pre-wrap">{story.content}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mt-4 text-xs text-gray-500 flex justify-between items-center font-system"
        >
          <span>#{story.number}</span>
          <span>{new Date(story.createdAt).toLocaleString()}</span>
          <span>{story.model}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mt-4 p-4 bg-white bg-opacity-50 rounded-lg flex items-center font-system"
        >
          <div className="flex-grow flex items-center">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-grow p-2 border rounded-l"
              onClick={(e) => e.currentTarget.select()}
            />
            <button
              onClick={handleCopyLink}
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors flex items-center"
            >
              <FiShare2 className="mr-2" />
              Копировать
            </button>
          </div>
        </motion.div>
      </div>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={handleCreateNewStory}
        className="mt-8 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors text-lg font-semibold font-system"
      >
        Создать свою историю
      </motion.button>
      <footer className="w-full text-center py-4 mt-8 font-system">
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