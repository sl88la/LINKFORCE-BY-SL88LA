
export interface LinkItem {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  icon?: string;
}

export interface Theme {
  id: string;
  name: string;
  bgClass: string;
  textClass: string;
  descriptionClass: string;
}

export type BackgroundType = 'preset' | 'color' | 'image';
export type ButtonShape = 'pill' | 'rounded' | 'sharp';
export type ButtonStyle = 'solid' | 'outline' | 'soft' | 'glass';
export type FontFamily = 'inter' | 'dm-serif' | 'mono';

export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl: string; // Using picsum or uploaded base64
  links: LinkItem[];
  
  // Theme & Background Settings (Main Profile)
  themeId: string;
  backgroundType: BackgroundType;
  customBackgroundColor: string;
  customBackgroundImage: string;
  customTextColor: 'white' | 'black'; 
  
  // Advanced Customization
  buttonShape: ButtonShape;
  buttonStyle: ButtonStyle;
  fontFamily: FontFamily;

  // ID Card Specific Settings
  cardBackgroundType: 'match' | 'color' | 'image';
  cardBackgroundColor: string;
  cardBackgroundImage: string;
  cardTextColor: 'white' | 'black'; // New field for card text contrast
}

export const DEFAULT_THEMES: Theme[] = [
  {
    id: 'minimal',
    name: 'Clean White',
    bgClass: 'bg-slate-50',
    textClass: 'text-slate-900',
    descriptionClass: 'text-slate-500'
  },
  {
    id: 'dark-mode',
    name: 'Midnight',
    bgClass: 'bg-slate-950',
    textClass: 'text-white',
    descriptionClass: 'text-slate-400'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    bgClass: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600',
    textClass: 'text-white',
    descriptionClass: 'text-orange-100'
  },
  {
    id: 'ocean',
    name: 'Abyss',
    bgClass: 'bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-800 via-slate-900 to-black',
    textClass: 'text-blue-50',
    descriptionClass: 'text-blue-200'
  },
  {
    id: 'forest',
    name: 'Aurora',
    bgClass: 'bg-gradient-to-tr from-emerald-900 via-teal-900 to-slate-900',
    textClass: 'text-emerald-50',
    descriptionClass: 'text-emerald-200'
  },
  {
    id: 'neon',
    name: 'Cyberpunk',
    bgClass: 'bg-black',
    textClass: 'text-pink-500',
    descriptionClass: 'text-pink-300'
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: "Ahmed Ali",
  bio: "Digital Creator | Tech Enthusiast | Building cool things 🚀",
  avatarUrl: "https://picsum.photos/200",
  themeId: 'dark-mode',
  links: [
    { id: '1', title: 'My Portfolio', url: 'https://example.com', isActive: true },
    { id: '2', title: 'Twitter / X', url: 'https://twitter.com', isActive: true },
    { id: '3', title: 'Instagram', url: 'https://instagram.com', isActive: true },
  ],
  backgroundType: 'preset',
  customBackgroundColor: '#0f172a',
  customBackgroundImage: '',
  customTextColor: 'white',
  buttonShape: 'pill',
  buttonStyle: 'glass',
  fontFamily: 'inter',
  
  // Card Defaults
  cardBackgroundType: 'match',
  cardBackgroundColor: '#000000',
  cardBackgroundImage: '',
  cardTextColor: 'white'
};
