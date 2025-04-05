'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ArtistCardProps {
  name: string;
  username: string;
  role: string;
  categories: string[];
  avatarUrl: string;
  bio: string;
  stats: {
    contributors: number;
    followers: number;
    tokens: number;
  };
}

export default function ArtistCard({ 
  name, 
  username, 
  role, 
  categories,
  avatarUrl, 
  bio, 
  stats 
}: ArtistCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Link 
      href={`/${username}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={avatarUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 64px, 64px"
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-gray-600">{role}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span 
              key={category}
              className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {category}
            </span>
          ))}
        </div>

        <p className="mt-4 text-gray-600 text-sm line-clamp-2">{bio}</p>

        <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-sm font-semibold">{formatNumber(stats.contributors)}</p>
            <p className="text-xs text-gray-500">Contributors</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">{formatNumber(stats.followers)}</p>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">{formatNumber(stats.tokens)}</p>
            <p className="text-xs text-gray-500">Tokens</p>
          </div>
        </div>
      </div>
    </Link>
  );
} 