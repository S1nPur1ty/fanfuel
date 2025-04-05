export interface CategoryData {
  id: string;
  name: string;
  artistCount: number;
  artworkCount: number;
  trending: boolean;
  growthRate: number; // Percentage growth in the last 7 days
}

export const trendingCategories: CategoryData[] = [
  {
    id: 'all',
    name: 'All',
    artistCount: 0, // Special category
    artworkCount: 0,
    trending: false,
    growthRate: 0
  },
  {
    id: 'digital-art',
    name: 'Digital Art',
    artistCount: 12500,
    artworkCount: 45000,
    trending: true,
    growthRate: 25.5
  },
  {
    id: 'illustration',
    name: 'Illustration',
    artistCount: 8900,
    artworkCount: 32000,
    trending: true,
    growthRate: 18.3
  },
  {
    id: '3d-art',
    name: '3D Art',
    artistCount: 5600,
    artworkCount: 19500,
    trending: true,
    growthRate: 42.1
  },
  {
    id: 'concept-art',
    name: 'Concept Art',
    artistCount: 4200,
    artworkCount: 15800,
    trending: true,
    growthRate: 15.7
  },
  {
    id: 'character-design',
    name: 'Character Design',
    artistCount: 6300,
    artworkCount: 28000,
    trending: true,
    growthRate: 22.4
  },
  {
    id: 'animation',
    name: 'Animation',
    artistCount: 3800,
    artworkCount: 12000,
    trending: true,
    growthRate: 35.2
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    artistCount: 2900,
    artworkCount: 9500,
    trending: true,
    growthRate: 28.9
  },
  {
    id: 'traditional-art',
    name: 'Traditional Art',
    artistCount: 7200,
    artworkCount: 25000,
    trending: true,
    growthRate: 12.6
  }
]; 