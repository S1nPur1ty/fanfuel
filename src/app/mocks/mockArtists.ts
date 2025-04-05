export interface Artist {
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
  images?: {
    id: string;
    src: string;
    alt: string;
  }[];
}

export const mockArtists: Artist[] = [
  {
    name: 'Eleanor Pena',
    username: 'eleanor',
    role: 'Digital Artist',
    categories: ['Digital Art', 'Illustration'],
    avatarUrl: 'https://ui-avatars.com/api/?name=Eleanor%20Pena&size=256&background=random',
    bio: 'Creating digital art and illustrations. Let\'s make something amazing together!',
    stats: {
      contributors: 58200,
      followers: 1200000,
      tokens: 130000,
    },
    images: [
      { id: '1', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=EleanorPena1', alt: 'Digital Art 1' },
      { id: '2', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=EleanorPena2', alt: 'Digital Art 2' },
      { id: '3', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=EleanorPena3', alt: 'Digital Art 3' },
      { id: '4', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=EleanorPena4', alt: 'Digital Art 4' },
      { id: '5', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=EleanorPena5', alt: 'Digital Art 5' },
      { id: '6', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=EleanorPena6', alt: 'Digital Art 6' },
    ],
  },
  {
    name: 'Jenny Wilson',
    username: 'jenny',
    role: 'Illustrator',
    categories: ['Illustration', 'Traditional Art'],
    avatarUrl: 'https://ui-avatars.com/api/?name=Jenny%20Wilson&size=256&background=random',
    bio: 'Bringing imagination to life through vibrant illustrations and creative designs.',
    stats: {
      contributors: 42300,
      followers: 890000,
      tokens: 95000,
    },
    images: [
      { id: '1', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=JennyWilson1', alt: 'Illustration 1' },
      { id: '2', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=JennyWilson2', alt: 'Illustration 2' },
      { id: '3', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=JennyWilson3', alt: 'Illustration 3' },
      { id: '4', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=JennyWilson4', alt: 'Illustration 4' },
    ],
  },
  {
    name: 'Robert Fox',
    username: 'robert',
    role: '3D Artist',
    categories: ['3D Art', 'Animation'],
    avatarUrl: 'https://ui-avatars.com/api/?name=Robert%20Fox&size=256&background=random',
    bio: 'Specializing in 3D character design and animation. Let\'s create something unique!',
    stats: {
      contributors: 31500,
      followers: 650000,
      tokens: 78000,
    },
    images: [
      { id: '1', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=RobertFox1', alt: '3D Art 1' },
      { id: '2', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=RobertFox2', alt: '3D Art 2' },
      { id: '3', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=RobertFox3', alt: '3D Art 3' },
      { id: '4', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=RobertFox4', alt: '3D Art 4' },
      { id: '5', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=RobertFox5', alt: '3D Art 5' },
    ],
  },
  {
    name: 'Kristin Watson',
    username: 'kristin',
    role: 'Concept Artist',
    categories: ['Concept Art', 'Digital Art'],
    avatarUrl: 'https://ui-avatars.com/api/?name=Kristin%20Watson&size=256&background=random',
    bio: 'Transforming ideas into stunning visual concepts. Join me on this creative journey!',
    stats: {
      contributors: 27800,
      followers: 520000,
      tokens: 63000,
    },
    images: [
      { id: '1', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=KristinWatson1', alt: 'Concept Art 1' },
      { id: '2', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=KristinWatson2', alt: 'Concept Art 2' },
      { id: '3', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=KristinWatson3', alt: 'Concept Art 3' },
    ],
  },
  {
    name: 'Cameron Williamson',
    username: 'cameron',
    role: 'Digital Painter',
    categories: ['Digital Art', 'Traditional Art'],
    avatarUrl: 'https://ui-avatars.com/api/?name=Cameron%20Williamson&size=256&background=random',
    bio: 'Digital painting enthusiast creating dreamlike landscapes and characters.',
    stats: {
      contributors: 24600,
      followers: 480000,
      tokens: 55000,
    },
    images: [
      { id: '1', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=CameronWilliamson1', alt: 'Digital Painting 1' },
      { id: '2', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=CameronWilliamson2', alt: 'Digital Painting 2' },
      { id: '3', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=CameronWilliamson3', alt: 'Digital Painting 3' },
      { id: '4', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=CameronWilliamson4', alt: 'Digital Painting 4' },
    ],
  },
  {
    name: 'Leslie Alexander',
    username: 'leslie',
    role: 'Character Artist',
    categories: ['Character Design', 'Concept Art'],
    avatarUrl: 'https://ui-avatars.com/api/?name=Leslie%20Alexander&size=256&background=random',
    bio: 'Passionate about character design and storytelling through art.',
    stats: {
      contributors: 21900,
      followers: 430000,
      tokens: 48000,
    },
    images: [
      { id: '1', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=LeslieAlexander1', alt: 'Character Design 1' },
      { id: '2', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=LeslieAlexander2', alt: 'Character Design 2' },
      { id: '3', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=LeslieAlexander3', alt: 'Character Design 3' },
      { id: '4', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=LeslieAlexander4', alt: 'Character Design 4' },
      { id: '5', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=LeslieAlexander5', alt: 'Character Design 5' },
      { id: '6', src: 'https://api.dicebear.com/7.x/pixel-art/png?seed=LeslieAlexander6', alt: 'Character Design 6' },
    ],
  },
]; 