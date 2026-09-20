import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: `Jaaniye ${siteConfig.name} ke baare mein — India ka entertainment platform Hindi jokes, memes aur funny images ke liye.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <LegalLayout title="About Us" path="/about">
      <p>
        <strong>{siteConfig.name}</strong> ek entertainment platform hai jahan aapko milte hain best Hindi
        Jokes, Hinglish Jokes, English Jokes, Funny Memes, Desi Memes, Festival Memes aur Funny Images — sab
        ek hi jagah, bilkul free.
      </p>
      <p>
        Humara mission simple hai: har Indian ke din mein thodi hasi jodna. Chahe aap office break pe ho,
        WhatsApp pe status daalna ho, ya bas thoda relax karna ho — {siteConfig.name} aapke liye roz naya
        content laata hai.
      </p>
      <h2>Humara Vision</h2>
      <p>
        Hum believe karte hain ki hasi sabse achi medicine hai. Isliye humne banaya hai ek clean, fast aur
        mobile-friendly platform jahan bina login ke, bina jhanjhat ke, aap jokes aur memes browse, copy,
        download aur share kar sakte hain.
      </p>
      <h2>Kya Milega Yahan?</h2>
      <ul>
        <li>Hindi, Hinglish aur English jokes — Family, Office, School, Love aur bhi kayi categories mein</li>
        <li>Original, procedurally designed funny meme images — Desi, Animal, Trending aur Festival</li>
        <li>Har tyohaar ke special jokes, memes aur shareable wishes</li>
        <li>WhatsApp status, shayari aur funny images ka dedicated section</li>
        <li>Bina login ke bookmark aur dark mode jaisi features</li>
      </ul>
      <h2>Content Policy</h2>
      <p>
        Saara content JokeMasti team dwara likha/generate kiya gaya hai. Hum kisi bhi copyrighted ya
        offensive content ko publish nahi karte. Agar aapko koi issue milta hai, humein{" "}
        <a href="/contact">Contact Us</a> page se bataayein.
      </p>
    </LegalLayout>
  );
}
