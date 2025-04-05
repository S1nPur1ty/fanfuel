'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { UserImage } from './UserImages';

interface ImageModalProps {
  image: UserImage;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({ image, isOpen, onClose }: ImageModalProps) {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Re-enable scrolling when modal is closed
        document.body.style.overflow = 'auto';
      }, 300);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen]);
  
  if (!isOpen && !isVisible) return null;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(image.ipfs_url || image.original_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this AI-generated image: ${image.prompt}`)}&url=${encodeURIComponent(image.ipfs_url || image.original_url)}`;
    window.open(url, '_blank');
  };
  
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(image.ipfs_url || image.original_url)}`;
    window.open(url, '_blank');
  };
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };
  
  return (
    <div 
      className={`fixed inset-0 bg-black/90 flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      {/* Close button in top-right corner */}
      <button 
        onClick={handleClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Main content */}
      <div 
        className={`relative max-w-6xl w-full h-[90vh] flex flex-col transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image container */}
        <div className="relative flex-grow overflow-hidden">
          <Image
            src={image.ipfs_url || image.original_url}
            alt={image.prompt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            className="object-contain"
            priority
          />
        </div>
        
        {/* Info panel at bottom */}
        <div className="bg-white/10 backdrop-blur-md text-white p-4 mt-2 rounded-lg">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex-1 min-w-[200px]">
              <h3 className="text-lg font-medium truncate">{image.prompt}</h3>
              <p className="text-sm text-gray-300 mt-1">
                {new Date(image.created_at).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={shareOnTwitter}
                className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-1"
                aria-label="Share on Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={shareOnFacebook}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full flex items-center gap-1"
                aria-label="Share on Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={copyToClipboard}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full flex items-center gap-1"
                aria-label="Copy URL"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy URL'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 