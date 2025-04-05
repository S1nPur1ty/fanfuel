'use client';

import Image from 'next/image';

interface ProfileHeaderProps {
  name: string;
  role: string;
  avatarUrl: string;
  stats: {
    contributors: number;
    followers: number;
    tokens: number;
  };
  bio: string;
}

export default function ProfileHeader({ name, role, avatarUrl, stats, bio }: ProfileHeaderProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative w-48 h-48 rounded-full overflow-hidden">
          <Image
            src={avatarUrl}
            alt={name}
            fill
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

          <div className="mt-6">
            <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
              Contribute
            </button>
          </div>

          <p className="mt-6 text-gray-700">{bio}</p>
        </div>
      </div>
    </div>
  );
} 