import type { WhatsappItem } from "@/types/content";

// Short-form WhatsApp status / shayari content. Jokes tagged `whatsapp: true`
// in jokes.ts and memes tagged `funnyImage: true` in memes.ts fill out the
// "WhatsApp Jokes" and "Funny Images" parts of the WhatsApp section.
export const whatsappContent: WhatsappItem[] = [
  // ---- Funny Status ----
  { id: "w001", type: "funny-status", text: "Diet start karne ka best din hamesha “kal” hota hai. 😅", tags: ["diet", "kal", "funny"] },
  { id: "w002", type: "funny-status", text: "Mera bank balance aur mera mood, dono hi kabhi predict nahi ho paate. 💸", tags: ["bank", "mood", "funny"] },
  { id: "w003", type: "funny-status", text: "Overthinking ka champion award mujhe milna chahiye — sirf sochne mein hi expert hoon. 🧠", tags: ["overthinking", "funny"] },
  { id: "w004", type: "funny-status", text: "Meri productivity aur Monday, dono opposite directions mein chalte hain. 🐢", tags: ["monday", "productivity", "funny"] },
  { id: "w005", type: "funny-status", text: "Mujhe lagta hai mera alarm aur mera irada, dono hi snooze ho jaate hain. ⏰", tags: ["alarm", "irada", "funny"] },
  { id: "w006", type: "funny-status", text: "Dosti sacchi hai jab tak Maggi ka last bite share ho jaaye. 🍜", tags: ["dosti", "maggi", "funny"] },

  // ---- Regular Status ----
  { id: "w007", type: "status", text: "Zindagi mein hasna zaroori hai, warna serious log bhi bore ho jaate hain. 😄", tags: ["zindagi", "hasna"] },
  { id: "w008", type: "status", text: "Chhoti khushiyan dhoondo, bade jokes yahin milenge — JokeMasti pe roz naya hasi ka dose. 😂", tags: ["khushiyan", "jokemasti"] },
  { id: "w009", type: "status", text: "Weekend ka intezaar Monday se hi shuru ho jaata hai. 🎉", tags: ["weekend", "monday"] },
  { id: "w010", type: "status", text: "Chai, dost aur thoda sa gossip — perfect combo har mood ke liye. ☕", tags: ["chai", "dost", "gossip"] },
  { id: "w011", type: "status", text: "Muskurahat sabse sasta aur sabse best accessory hai. 😊", tags: ["muskurahat", "positivity"] },

  // ---- Good Morning ----
  { id: "w012", type: "good-morning", text: "Good Morning! Aaj ka din bhi utna hi mast hoga jitni aapki muskaan. ☀️😊", tags: ["good-morning", "positivity"] },
  { id: "w013", type: "good-morning", text: "Uthiye, chai pijiye aur din ki shuruwat ek achi joke ke saath kariye. ☕😄", tags: ["good-morning", "chai"] },
  { id: "w014", type: "good-morning", text: "Naya din, nayi hasi, nayi energy — Good Morning JokeMasti family! 🌞", tags: ["good-morning", "energy"] },
  { id: "w015", type: "good-morning", text: "Subah subah ek smile free hai, bant dijiye sabko. Good Morning! 😁", tags: ["good-morning", "smile"] },

  // ---- Good Night ----
  { id: "w016", type: "good-night", text: "Din bhar ki hasi yahin khatam nahi hoti, kal phir milte hain naye jokes ke saath. Good Night! 🌙", tags: ["good-night", "rest"] },
  { id: "w017", type: "good-night", text: "Aaj ki saari tension yahin chhodo, sapno mein sirf hasi le jao. Good Night! 😴", tags: ["good-night", "sapne"] },
  { id: "w018", type: "good-night", text: "Sitaron ki tarah chamakte rehna, so jao ab, kal phir milte hain. ✨ Good Night!", tags: ["good-night", "sitare"] },
  { id: "w019", type: "good-night", text: "Aaram karo, kal ek aur mast joke ke saath milenge. Sweet Dreams! 🌜", tags: ["good-night", "sweet-dreams"] },

  // ---- Friendship Status ----
  { id: "w020", type: "friendship-status", text: "Dost wo hote hain jo bina bataye samajh jaate hain — value karo unki. 🤝", tags: ["friendship", "dost"] },
  { id: "w021", type: "friendship-status", text: "Real dosti WhatsApp status se nahi, 2 baje raat ki calls se pehchani jaati hai. 📞", tags: ["friendship", "raat"] },
  { id: "w022", type: "friendship-status", text: "Sabse achi dosti wo hai jisme khamoshi bhi comfortable lagti hai. 🧡", tags: ["friendship", "khamoshi"] },
  { id: "w023", type: "friendship-status", text: "Dosti mein hisaab nahi hota, bas trust hota hai. 🙌", tags: ["friendship", "trust"] },

  // ---- Shayari ----
  { id: "w024", type: "shayari", text: "हँसी के दो पल जिंदगी को हल्का कर देते हैं,\nJokeMasti पर रोज़ ऐसे लम्हे मिल जाते हैं। 😊", tags: ["shayari", "hasi"] },
  { id: "w025", type: "shayari", text: "दोस्तों का साथ हो तो हर गम हल्का लगता है,\nहँसी-मज़ाक में हर दिन नया लगता है। 🤗", tags: ["shayari", "dosti"] },
  { id: "w026", type: "shayari", text: "मुस्कुराहट से बड़ा कोई तोहफा नहीं होता,\nजो बाँटो उतना ही ज़्यादा होता है। 😄", tags: ["shayari", "muskurahat"] },
  { id: "w027", type: "shayari", text: "ज़िंदगी में थोड़ी मस्ती ज़रूरी है,\nहर पल को हँसते हुए जीना ज़रूरी है। ✨", tags: ["shayari", "zindagi"] },
];

export function getWhatsappContentByType(type: string) {
  return whatsappContent.filter((w) => w.type === type);
}
