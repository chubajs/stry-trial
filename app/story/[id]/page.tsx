"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

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
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        console.log('Fetching story with id:', id);
        const response = await fetch(`/api/getStory/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Received story data:', data);
          setStory(data);
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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!story) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold mb-4">{story.title}</h1>
        <div className="text-gray-700 mb-4 whitespace-pre-wrap">{story.content}</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mt-4 text-xs text-gray-500 flex justify-between items-center"
      >
        <span>#{story.number}</span>
        <span>{new Date(story.createdAt).toLocaleString()}</span>
        <span>{story.model}</span>
      </motion.div>
    </div>
  );
}