'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Image from 'next/image';

export default function CreateFanImage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [artistData, setArtistData] = useState<{ name: string; username: string } | null>(null);

  const artistUsername = searchParams.get('artist');

  useEffect(() => {
    if (!artistUsername) {
      router.push('/');
      return;
    }

    // In a real app, fetch artist data from your API using the username
    // For now, we'll simulate it
    setArtistData({
      name: 'Eleanor Pena',
      username: artistUsername
    });
  }, [artistUsername, router]);

  const generateImage = async () => {
    if (!artistData) return;
    
    setLoading(true);
    try {
      // In a real app, this would call your API with the artist's username
      // API endpoint would be something like: /api/generate-fan?artist=${artistData.username}
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Using username in the image path for better organization
      setImageUrl(`/images/generated-fan-${artistData.username}.jpg`);
    } catch (error) {
      console.error('Failed to generate image:', error);
      // Add proper error handling here
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (imageUrl) {
      try {
        await navigator.clipboard.writeText(`${window.location.origin}${imageUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (!artistData) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">Generate Your Fan Image</h1>
          <p className="text-center text-gray-600 mb-8">Creating a unique fan image for {artistData.name}</p>
          
          <div className="text-center mb-8">
            <button
              onClick={generateImage}
              disabled={loading}
              className={`
                bg-black text-white px-8 py-3 rounded-full
                hover:bg-gray-800 transition
                disabled:bg-gray-400 disabled:cursor-not-allowed
              `}
            >
              {loading ? 'Generating...' : 'Generate Image'}
            </button>
          </div>

          {imageUrl && (
            <div className="space-y-6">
              <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={imageUrl}
                  alt={`Generated fan image for ${artistData.name}`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                <input
                  type="text"
                  value={`${window.location.origin}${imageUrl}`}
                  readOnly
                  className="flex-1 bg-white border border-gray-200 rounded-md px-4 py-2 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition min-w-[100px]"
                >
                  {copied ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 