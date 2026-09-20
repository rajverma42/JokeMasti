import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: `${siteConfig.name} use karne ke Terms & Conditions.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" path="/terms" updated="20 September 2026">
      <p>
        {siteConfig.url} (&ldquo;{siteConfig.name}&rdquo; or &ldquo;Site&rdquo;) use karke, aap in Terms &amp;
        Conditions se agree karte hain. Agar aap in terms se agree nahi karte, please site use na karein.
      </p>

      <h2>Use of Content</h2>
      <p>
        Jokes, memes aur images is site par personal, non-commercial use ke liye — sharing sahit — free hain.
        Bulk scraping, re-selling, ya humare branding ke bina commercial redistribution allowed nahi hai.
      </p>

      <h2>No Account Required</h2>
      <p>
        {siteConfig.name} ko browse, search, copy, share, download aur bookmark karne ke liye koi login ya
        sign-up zaroori nahi hai. Kuch features (bookmarks, theme, recent searches) locally aapke browser
        mein store hoti hain.
      </p>

      <h2>Acceptable Use</h2>
      <ul>
        <li>Site ko kisi illegal, harmful, ya abusive purpose ke liye use na karein</li>
        <li>Automated scraping ya excessive load site pe daalne se bachein</li>
        <li>Copyright ya intellectual property rights violate na karein</li>
      </ul>

      <h2>Content Accuracy</h2>
      <p>
        Jokes aur memes entertainment purpose ke liye hain. Hum accuracy, completeness, ya kisi bhi content
        ki suitability ki guarantee nahi dete.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        {siteConfig.name} site ko &ldquo;as is&rdquo; basis pe provide karti hai. Hum kisi bhi direct ya
        indirect damage ke liye liable nahi honge jo site use se result ho.
      </p>

      <h2>Changes</h2>
      <p>Hum in Terms ko update karne ka right reserve karte hain. Continued use ka matlab hai updated terms se agreement.</p>

      <h2>Contact</h2>
      <p>
        Questions ke liye <a href="/contact">Contact Us</a> page use kariye.
      </p>
    </LegalLayout>
  );
}
