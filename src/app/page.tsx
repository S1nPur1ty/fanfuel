'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import ArtistCard from './components/ArtistCard';
import { CategoryData, trendingCategories } from './mocks/trendingCategories';
import { mockArtists } from './mocks/mockArtists';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(['All']));
  const [customCategories, setCustomCategories] = useState<CategoryData[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Combine trending and custom categories
  const allCategories = [...trendingCategories, ...customCategories];

  const isDefaultCategory = (categoryName: string): boolean => {
    return trendingCategories.some(cat => cat.name === categoryName);
  };

  const categoryExists = (categoryName: string): boolean => {
    return allCategories.some(
      category => category.name.toLowerCase() === categoryName.toLowerCase()
    );
  };

  const getCategoryData = (categoryName: string): CategoryData | undefined => {
    return allCategories.find(cat => cat.name === categoryName);
  };

  const toggleCategory = (categoryName: string) => {
    const newCategories = new Set(selectedCategories);
    
    if (categoryName === 'All') {
      setSelectedCategories(new Set(['All']));
      return;
    }

    if (newCategories.has('All')) {
      newCategories.delete('All');
    }

    if (newCategories.has(categoryName)) {
      newCategories.delete(categoryName);
      if (newCategories.size === 0) {
        newCategories.add('All');
      }
    } else {
      newCategories.add(categoryName);
    }

    setSelectedCategories(newCategories);
  };

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();
    
    if (!trimmedCategory) {
      setError('Category name cannot be empty');
      return;
    }

    if (categoryExists(trimmedCategory)) {
      setError('This category already exists');
      return;
    }

    const newCategoryData: CategoryData = {
      id: trimmedCategory.toLowerCase().replace(/\s+/g, '-'),
      name: trimmedCategory,
      artistCount: 0,
      artworkCount: 0,
      trending: false,
      growthRate: 0
    };

    setCustomCategories([...customCategories, newCategoryData]);
    setNewCategory('');
    setShowAddCategory(false);
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  const handleRemoveCategory = (categoryName: string) => {
    // For default categories, just remove from selection
    if (isDefaultCategory(categoryName)) {
      if (selectedCategories.has(categoryName)) {
        const newSelected = new Set(selectedCategories);
        newSelected.delete(categoryName);
        
        if (newSelected.size === 0) {
          newSelected.add('All');
        }
        
        setSelectedCategories(newSelected);
      }
      return;
    }

    // For custom categories, remove from both lists
    setCustomCategories(customCategories.filter(cat => cat.name !== categoryName));
    
    if (selectedCategories.has(categoryName)) {
      const newSelected = new Set(selectedCategories);
      newSelected.delete(categoryName);
      
      if (newSelected.size === 0) {
        newSelected.add('All');
      }
      
      setSelectedCategories(newSelected);
    }
  };

  const filteredArtists = mockArtists.filter(artist => {
    const matchesSearch = 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategories.has('All') ||
      artist.categories.some(category => selectedCategories.has(category));

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Explore Artists</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover talented artists from around the world. Support their work and become part of their creative journey.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <input
            type="text"
            placeholder="Search artists by name, role, or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-2xl mx-auto block px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />

          <div className="flex flex-wrap justify-center gap-2">
            {allCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.name)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition group relative
                  ${selectedCategories.has(category.name)
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                <span className="flex items-center">
                  {category.name}
                  {category.name !== 'All' && (
                    <span className="ml-2 text-xs">
                      {category.artistCount > 0 ? category.artistCount.toLocaleString() : '0'}
                    </span>
                  )}
                  {category.name !== 'All' && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCategory(category.name);
                      }}
                      className={`
                        ml-2 w-4 h-4 rounded-full flex items-center justify-center
                        ${selectedCategories.has(category.name)
                          ? 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                          : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                        }
                        transition
                      `}
                      title={isDefaultCategory(category.name) ? "Remove from selection" : "Remove category"}
                    >
                      ×
                    </div>
                  )}
                </span>
                {category.trending && category.growthRate > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 text-white text-[8px] items-center justify-center">
                      ↑
                    </span>
                  </span>
                )}
              </button>
            ))}
            
            <button
              onClick={() => {
                setShowAddCategory(true);
                setError(null);
              }}
              className="px-4 py-2 rounded-full text-sm font-medium transition bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 flex items-center"
            >
              <span className="mr-1">+</span> Add Category
            </button>
          </div>

          {showAddCategory && (
            <div className="space-y-2">
              <div className="flex justify-center gap-2">
                <input
                  type="text"
                  placeholder="Enter new category"
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleKeyPress}
                  className="px-4 py-2 rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-black text-white hover:bg-gray-800 transition"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategory('');
                    setError(null);
                  }}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                >
                  Cancel
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </div>
          )}

          {selectedCategories.size > 0 && !selectedCategories.has('All') && (
            <div className="flex justify-center">
              <p className="text-sm text-gray-500">
                Filtering by: {Array.from(selectedCategories).join(', ')}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <ArtistCard
              key={artist.username}
              {...artist}
            />
          ))}
        </div>

        {filteredArtists.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            No artists found matching your search criteria.
          </div>
        )}
      </div>
    </main>
  );
} 