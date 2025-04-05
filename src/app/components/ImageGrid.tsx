'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserImage } from './UserImages';
import ImageModal from './ImageModal';

interface ImageGridProps {
  images: UserImage[];
}

export default function ImageGrid({ images }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<UserImage | null>(null);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div 
            key={image.id} 
            className="relative rounded-lg overflow-hidden hover:opacity-90 transition cursor-pointer shadow-sm"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative h-48 w-full">
              <Image
                src={image.ipfs_url || image.original_url}
                alt={image.prompt}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 truncate">{image.prompt}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(image.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          isOpen={!!selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
} 