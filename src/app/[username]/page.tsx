'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import ProfileHeader from '../components/ProfileHeader';
import TabNavigation from '../components/TabNavigation';
import ImageGrid from '../components/ImageGrid';
import { mockArtists } from '../mocks/mockArtists';

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<'images' | 'collections' | 'about'>('images');
  const params = useParams();
  const username = params.username as string;

  // Find the artist data from mockArtists
  const userData = mockArtists.find(artist => artist.username === username);

  if (!userData) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          <p className="text-center text-gray-500">Artist not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="relative">
        <ProfileHeader
          name={userData.name}
          username={userData.username}
          role={userData.role}
          avatarUrl={userData.avatarUrl}
          stats={userData.stats}
          bio={userData.bio}
        />
      </div>

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'images' && userData.images && (
        <ImageGrid images={userData.images} />
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