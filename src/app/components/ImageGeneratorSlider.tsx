'use client';

import { useState } from 'react';
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
  const [outputFormat, setOutputFormat] = useState<'webp' | 'png' | 'jpg'>('webp');
  const [model, setModel] = useState<'dev' | 'schnell'>('dev');
  const [goFast, setGoFast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create the full prompt with username
      const fullPrompt = `${prompt} richard`;
      
      // Prepare the request body
      const requestBody = {
        version: "9b005fd3225f1483fead8e7d252d4058a3b1c961528cc95598b922fefc04f765",
        input: {
          prompt: fullPrompt,
          model: model,
          go_fast: goFast,
          lora_scale: 1,
          megapixels: "1",
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: outputFormat,
          guidance_scale: 3,
          output_quality: 80,
          prompt_strength: 0.8,
          extra_lora_scale: 1,
          num_inference_steps: 28
        }
      };
      
      // Make the API request to our Next.js API route
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get the output URL from the response
      const imageUrl = data.output[0];
      
      // Copy to clipboard automatically
      await navigator.clipboard.writeText(imageUrl);
      setIsCopied(true);
      
      // Call the callback to update the parent component
      onImageGenerated(imageUrl);
      
      // Close the slider after a short delay
      setTimeout(() => {
        onClose();
        // Reset state for next time
        setPrompt('');
      }, 1500);
    } catch (error) {
      console.error('Error generating image:', error);
      console.log(error);
      
      setError(error instanceof Error ? error.message : 'Failed to generate image');
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as 'dev' | 'schnell')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="dev">Dev (Better Quality)</option>
                <option value="schnell">Schnell (Faster)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Format
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as 'webp' | 'png' | 'jpg')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="webp">WebP</option>
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="goFast"
              checked={goFast}
              onChange={(e) => setGoFast(e.target.checked)}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label htmlFor="goFast" className="ml-2 block text-sm text-gray-700">
              Go Fast (Faster generation, lower quality)
            </label>
          </div>

          <button
            onClick={generateImage}
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {isCopied && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              Image URL copied to clipboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 