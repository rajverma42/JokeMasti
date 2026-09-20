export type Language = "hindi" | "hinglish" | "english";

export type JokeCategorySlug =
  | "hindi"
  | "funny"
  | "desi"
  | "whatsapp"
  | "love"
  | "family"
  | "school"
  | "office"
  | "friendship"
  | "clean";

export type MemeCategorySlug = "animal" | "desi" | "trending" | "festival";

export interface Joke {
  id: string;
  slug: string;
  title: string;
  text: string;
  category: JokeCategorySlug;
  tags: string[];
  language: Language;
  createdAt: string;
  likes: number;
  shares: number;
  views: number;
  festival?: string;
  whatsapp?: boolean;
  featured?: boolean;
}

export interface Meme {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  thumbnail: string;
  width: number;
  height: number;
  category: MemeCategorySlug;
  tags: string[];
  createdAt: string;
  likes: number;
  shares: number;
  downloads: number;
  views: number;
  festival?: string;
  funnyImage?: boolean;
  featured?: boolean;
}

export interface Category {
  slug: string;
  name: string;
  emoji: string;
  type: "joke" | "meme";
  description: string;
  href: string;
}

export interface Festival {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  dateHint: string;
}

export type WhatsappContentType =
  | "joke"
  | "status"
  | "funny-status"
  | "funny-image"
  | "good-morning"
  | "good-night"
  | "friendship-status"
  | "shayari";

export interface WhatsappItem {
  id: string;
  type: WhatsappContentType;
  text: string;
  tags: string[];
}
