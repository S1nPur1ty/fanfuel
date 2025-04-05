'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import ProfileHeader from '../components/ProfileHeader';
import TabNavigation from '../components/TabNavigation';
import ImageGrid from '../components/ImageGrid';

// Mock data - in a real app, this would come from an API
const mockUserData = {
  name: 'Eleanor Pena',
  role: 'Artist',
  avatarUrl: '/images/avatar.jpg',
  stats: {
    contributors: 58200,
    followers: 1200000,
    tokens: 130000,
  },
  bio: 'Creating digital art and illustrations. Let\'s make something amazing together!',
  images: [
    { id: '1', src: '/images/art1.jpg', alt: 'Digital Art 1' },
    { id: '2', src: '/images/art2.jpg', alt: 'Digital Art 2' },
    { id: '3', src: '/images/art3.jpg', alt: 'Digital Art 3' },
    { id: '4', src: '/images/art4.jpg', alt: 'Digital Art 4' },
    { id: '5', src: '/images/art5.jpg', alt: 'Digital Art 5' },
    { id: '6', src: '/images/art6.jpg', alt: 'Digital Art 6' },
  ],
};

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<'images' | 'collections' | 'about'>('images');

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <ProfileHeader
        name={mockUserData.name}
        role={mockUserData.role}
        avatarUrl={mockUserData.avatarUrl}
        stats={mockUserData.stats}
        bio={mockUserData.bio}
      />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'images' && (
        <ImageGrid images={mockUserData.images} />
      )}

      {activeTab === 'collections' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500 text-center">Collections coming soon...</p>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500 text-center">About section coming soon...</p>
        </div>
      )}
    </main>
  );
} 