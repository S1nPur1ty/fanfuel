'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { CategoryData, trendingCategories } from '../mocks/trendingCategories';
import { X } from "@phosphor-icons/react";

export default function CreateProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: '',
    bio: '',
    categories: [] as string[],
    avatarUrl: '',
    coverImageUrl: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      website: ''
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customCategories, setCustomCategories] = useState<CategoryData[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Combine trending and custom categories
  const allCategories = [...trendingCategories, ...customCategories];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialPlatform = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialPlatform]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const isDefaultCategory = (categoryName: string): boolean => {
    return trendingCategories.some(cat => cat.name === categoryName);
  };

  const categoryExists = (categoryName: string): boolean => {
    return allCategories.some(
      category => category.name.toLowerCase() === categoryName.toLowerCase()
    );
  };

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();
    
    if (!trimmedCategory) {
      setCategoryError('Category name cannot be empty');
      return;
    }

    if (categoryExists(trimmedCategory)) {
      setCategoryError('This category already exists');
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
    setCategoryError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  const handleRemoveCategory = (categoryName: string) => {
    // For all categories, remove from selection
    if (formData.categories.includes(categoryName)) {
      setFormData(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c !== categoryName)
      }));
    }

    // For custom categories, also remove from the list
    if (!isDefaultCategory(categoryName)) {
      setCustomCategories(customCategories.filter(cat => cat.name !== categoryName));
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      // For now, we'll just simulate a successful creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the new profile
      router.push(`/profile/${formData.username}`);
    } catch (err) {
      setError('Failed to create profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Create Artist Profile</h1>
          <p className="text-gray-600">
            Share your artwork with the world. Create a profile to showcase your work and connect with fans.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                pattern="[a-zA-Z0-9_-]+"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                Only letters, numbers, underscores, and hyphens allowed
              </p>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {allCategories
                  .filter(category => category.name !== 'All')
                  .map(category => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategoryChange(category.name)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition group relative
                        ${formData.categories.includes(category.name)
                          ? 'bg-black/10 text-black'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }
                      `}
                    >
                      <span className="flex items-center">
                        {category.name}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCategory(category.name);
                          }}
                          className={`
                            ml-2 w-4 h-4 rounded-full flex items-center justify-center cursor-pointer transition hover:bg-gray-400
                          `}
                          title="Remove category"
                        >
                        <X size={12} />
                        </div>
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
                  type="button"
                  onClick={() => {
                    setShowAddCategory(true);
                    setCategoryError(null);
                  }}
                  className="px-4 py-2 rounded-full text-sm font-medium transition bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 flex items-center"
                >
                  <span className="mr-1">+</span> Add Category
                </button>
              </div>

              {showAddCategory && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter new category"
                      value={newCategory}
                      onChange={(e) => {
                        setNewCategory(e.target.value);
                        setCategoryError(null);
                      }}
                      onKeyDown={handleKeyPress}
                      className="px-4 py-2 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent flex-grow"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 transition"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCategory('');
                        setCategoryError(null);
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                  {categoryError && (
                    <p className="text-red-500 text-sm">{categoryError}</p>
                  )}
                </div>
              )}

              {formData.categories.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Selected categories: {formData.categories.join(', ')}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                id="avatarUrl"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                id="coverImageUrl"
                name="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Links</h3>
              
              <div>
                <label htmlFor="social.twitter" className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  id="social.twitter"
                  name="social.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="social.instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  id="social.instagram"
                  name="social.instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="social.website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  id="social.website"
                  name="social.website"
                  value={formData.socialLinks.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 