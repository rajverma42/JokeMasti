export const siteConfig = {
  name: "JokeMasti",
  tagline: "Hasi Ka Daily Dose!",
  description:
    "Best Hindi Jokes, Hinglish Jokes, English Jokes, Funny Memes, Desi Memes aur Funny Images. Har din naya entertainment — JokeMasti pe.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://jokemasti.in",
  locale: "en_IN",
  twitterHandle: "@jokemasti",
  keywords: [
    "hindi jokes",
    "hinglish jokes",
    "funny memes",
    "desi memes",
    "whatsapp jokes",
    "funny images",
    "trending memes india",
    "festival jokes",
    "jokemasti",
  ],
};

export type SiteConfig = typeof siteConfig;
