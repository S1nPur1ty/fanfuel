'use client';

import { useState, useEffect } from 'react';
import ImageGrid from './ImageGrid';

export interface UserImage {
  id: number;
  user_id: string;
  prompt: string;
  original_url: string;
  ipfs_hash: string;
  ipfs_url: string;
  created_at: string;
}

interface UserImagesProps {
  userId: string;
}

export default function UserImages({ userId }: UserImagesProps) {
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log('Component - Starting to fetch images for userId:', userId);
        setLoading(true);
        
        const apiUrl = `/api/user-images?userId=${userId}`;
        console.log('Component - Fetching from URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('Component - Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Component - API error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch images');
        }
        
        const data = await response.json();
        console.log('Component - Received data:', data);
        console.log('Component - Number of images:', data.images?.length || 0);
        
        if (data.images && data.images.length > 0) {
          console.log('Component - First image:', data.images[0]);
        }
        
        setImages(data.images || []);
      } catch (err) {
        console.error('Component - Error fetching user images:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch images');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      console.log('Component - UserId provided, fetching images');
      fetchImages();
    } else {
      console.log('Component - No userId provided');
    }
  }, [userId]);

  console.log('Component - Render state:', { loading, error, imagesCount: images.length });

  if (loading) {
    return <div className="text-center py-8">Loading images...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (images.length === 0) {
    return <div className="text-center py-8">No images found for this user.</div>;
  }

  return (
    <ImageGrid images={images} />
  );
} 