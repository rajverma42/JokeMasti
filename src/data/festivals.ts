import type { Festival } from "@/types/content";

export const festivals: Festival[] = [
  { slug: "diwali", name: "Diwali", emoji: "🪔", dateHint: "Oct/Nov", description: "Diwali ke funny jokes, memes aur shareable wishes." },
  { slug: "holi", name: "Holi", emoji: "🎨", dateHint: "March", description: "Rangon ke tyohaar Holi ke best jokes aur memes." },
  { slug: "raksha-bandhan", name: "Raksha Bandhan", emoji: "🎗️", dateHint: "August", description: "Bhai-behen ke pyaar bhare funny jokes aur memes." },
  { slug: "independence-day", name: "Independence Day", emoji: "🇮🇳", dateHint: "15 August", description: "15 August special desh-bhakti se bhare funny jokes." },
  { slug: "republic-day", name: "Republic Day", emoji: "🎖️", dateHint: "26 January", description: "Republic Day ke funny jokes aur shareable memes." },
  { slug: "christmas", name: "Christmas", emoji: "🎄", dateHint: "25 December", description: "Christmas ke funny jokes, memes aur wishes." },
  { slug: "new-year", name: "New Year", emoji: "🎆", dateHint: "1 January", description: "Naye saal ka funny welcome, jokes aur resolution memes." },
  { slug: "eid", name: "Eid", emoji: "🌙", dateHint: "Varies", description: "Eid Mubarak ke funny jokes aur shareable memes." },
  { slug: "makar-sankranti", name: "Makar Sankranti", emoji: "🪁", dateHint: "14 January", description: "Patang aur til-gud wale funny jokes aur memes." },
  { slug: "navratri", name: "Navratri", emoji: "🪘", dateHint: "Sep/Oct", description: "Garba-Dandiya ke funny jokes aur memes." },
  { slug: "durga-puja", name: "Durga Puja", emoji: "🙏", dateHint: "Sep/Oct", description: "Durga Puja pandal-hopping ke funny jokes aur memes." },
  { slug: "chhath-puja", name: "Chhath Puja", emoji: "🌅", dateHint: "Oct/Nov", description: "Chhath Puja ke bhakti-bhare funny moments." },
  { slug: "valentines-day", name: "Valentine's Day", emoji: "💘", dateHint: "14 February", description: "Single aur committed dono ke liye funny jokes." },
  { slug: "friendship-day", name: "Friendship Day", emoji: "🤝", dateHint: "August", description: "Dosti ke naam funny jokes aur memes." },
  { slug: "mothers-day", name: "Mother's Day", emoji: "🌷", dateHint: "May", description: "Mummy ke pyaar bhare funny jokes aur memes." },
  { slug: "fathers-day", name: "Father's Day", emoji: "👔", dateHint: "June", description: "Papa ke gyaan bhare funny jokes aur memes." },
];

export function getFestival(slug: string) {
  return festivals.find((f) => f.slug === slug);
}
