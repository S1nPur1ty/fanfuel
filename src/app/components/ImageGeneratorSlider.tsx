'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageGeneratorSliderProps {
  artistName: string;
  artistUsername: string;
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (imageUrl: string) => void;
}

export default function ImageGeneratorSlider({ 
  artistName, 
  artistUsername, 
  isOpen, 
  onClose,
  onImageGenerated
}: ImageGeneratorSliderProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call to generate image
      // In a real implementation, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, we'll use a placeholder image
      const seed = encodeURIComponent(`${artistUsername}-${prompt}`);
      const imageUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`;
      
      // Copy to clipboard automatically
      await navigator.clipboard.writeText(imageUrl);
      setIsCopied(true);
      
      // Call the callback to update the parent component
      onImageGenerated(imageUrl);
      
      onClose();
      setPrompt('');
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the overlay, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/20 z-50 flex justify-end transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={handleOverlayClick}
    >
      <div 
        className={`bg-white w-full max-w-md h-full shadow-xl p-6 overflow-y-auto transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Generate Image for {artistName}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your prompt
            </label>
            <textarea
              id="prompt"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          <button
            onClick={generateImage}
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
      </div>
    </div>
  );
} 