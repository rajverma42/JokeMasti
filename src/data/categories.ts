import type { Category } from "@/types/content";

export const jokeCategories: Category[] = [
  { slug: "hindi", name: "Hindi Jokes", emoji: "😂", type: "joke", href: "/jokes/hindi", description: "Sabse popular Hindi jokes jo har mehfil mein hasi la de." },
  { slug: "funny", name: "Funny Jokes", emoji: "🤣", type: "joke", href: "/jokes/funny", description: "Non-stop hasane wale funny jokes ka collection." },
  { slug: "desi", name: "Desi Jokes", emoji: "😎", type: "joke", href: "/jokes/desi", description: "Pure desi swag wale jokes, ekdum ghar jaisa tadka." },
  { slug: "whatsapp", name: "WhatsApp Jokes", emoji: "💬", type: "joke", href: "/jokes/whatsapp", description: "Group mein forward karne layak best WhatsApp jokes." },
  { slug: "love", name: "Love Jokes", emoji: "❤️", type: "joke", href: "/jokes/love", description: "Pyaar-mohabbat pe halke-fulke funny jokes." },
  { slug: "family", name: "Family Jokes", emoji: "👨‍👩‍👧", type: "joke", href: "/jokes/family", description: "Ghar ke har member ko hasane wale family jokes." },
  { slug: "school", name: "School Jokes", emoji: "🏫", type: "joke", href: "/jokes/school", description: "School ke din yaad dilane wale funny jokes." },
  { slug: "office", name: "Office Jokes", emoji: "💼", type: "joke", href: "/jokes/office", description: "Boss, deadline aur meetings pe mast office jokes." },
  { slug: "friendship", name: "Friendship Jokes", emoji: "👫", type: "joke", href: "/jokes/friendship", description: "Dosti ke naam best friendship jokes." },
  { slug: "clean", name: "Adult-Free Clean Jokes", emoji: "😜", type: "joke", href: "/jokes/clean", description: "Sabke saath share karne layak clean, family-friendly jokes." },
];

export const memeCategories: Category[] = [
  { slug: "animal", name: "Animal Memes", emoji: "🐶", type: "meme", href: "/memes/animal", description: "Cute aur funny animal memes." },
  { slug: "desi", name: "Desi Memes", emoji: "🇮🇳", type: "meme", href: "/memes/desi", description: "Har Indian ko relatable desi memes." },
  { slug: "trending", name: "Trending Memes", emoji: "🔥", type: "meme", href: "/memes/trending", description: "Abhi trend mein chal rahe memes." },
  { slug: "festival", name: "Festival Memes", emoji: "🎉", type: "meme", href: "/memes/festival", description: "Har tyohaar ke special memes." },
];

export const allCategories: Category[] = [...jokeCategories, ...memeCategories];

export function getJokeCategory(slug: string) {
  return jokeCategories.find((c) => c.slug === slug);
}

export function getMemeCategory(slug: string) {
  return memeCategories.find((c) => c.slug === slug);
}
