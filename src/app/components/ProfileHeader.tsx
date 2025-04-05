'use client';

import Image from 'next/image';
import { useState } from 'react';
import ImageGeneratorSlider from './ImageGeneratorSlider';

interface ProfileHeaderProps {
  name: string;
  username: string;
  role: string;
  avatarUrl: string;
  stats: {
    contributors: number;
    followers: number;
    tokens: number;
  };
  bio: string;
}

export default function ProfileHeader({ name, username, role, avatarUrl, stats, bio }: ProfileHeaderProps) {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleImageGenerated = (imageUrl: string) => {
    setGeneratedImageUrl(imageUrl);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative w-48 h-48 rounded-full overflow-hidden">
          <Image
            src={avatarUrl}
            alt={name}
            fill
            priority
            sizes="(max-width: 768px) 192px, 192px"
            className="object-cover"
          />
        </div>
        
        <div className="flex-1">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold">{name}</h1>
            <p className="text-xl text-gray-600 mt-2">{role}</p>
          </div>

          <div className="flex justify-center md:justify-start gap-12 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{formatNumber(stats.contributors)}</p>
              <p className="text-gray-600">Contributors</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{formatNumber(stats.followers)}</p>
              <p className="text-gray-600">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{formatNumber(stats.tokens)}</p>
              <p className="text-gray-600">Tokens</p>
            </div>
          </div>

          <div className="mt-6 flex justify-center md:justify-start">
            <button
              onClick={() => setIsSliderOpen(true)}
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition cursor-pointer"
            >
              Contribute
            </button>
          </div>

          <p className="mt-6 text-gray-700 text-center md:text-left">{bio}</p>
        </div>
      </div>
      
      {generatedImageUrl && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Your Generated Image</h2>
          <div className="max-w-md mx-auto relative aspect-square rounded-lg overflow-hidden shadow-lg">
            <Image
              src={generatedImageUrl}
              alt="Generated fan art"
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover"
            />
          </div>
        </div>
      )}
      
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          Image URL copied to clipboard!
        </div>
      )}
      
      <ImageGeneratorSlider
        artistName={name}
        artistUsername={username}
        isOpen={isSliderOpen}
        onClose={() => setIsSliderOpen(false)}
        onImageGenerated={handleImageGenerated}
      />
    </div>
  );
} 