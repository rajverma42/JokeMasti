import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `${siteConfig.name} ki Privacy Policy — cookies, analytics, advertising aur user data ke baare mein jaaniye.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" path="/privacy-policy" updated="20 September 2026">
      <p>
        {siteConfig.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your privacy. Ye Privacy
        Policy batati hai ki hum kaunsi information collect karte hain jab aap {siteConfig.url} use karte
        hain, aur usse kaise use karte hain.
      </p>

      <h2>Information We Collect</h2>
      <p>
        {siteConfig.name} ko use karne ke liye koi account ya sign-up zaroori nahi hai. Hum personally
        identifiable information (jaise naam ya email) tab hi collect karte hain jab aap khud Contact Us
        form use karke humein message bhejte hain.
      </p>

      <h2>Local Storage &amp; Cookies</h2>
      <p>
        Kuch features — jaise Dark Mode preference, Bookmarks, aur Recent Searches — aapke browser ke
        <code> localStorage</code> mein save hote hain. Ye data sirf aapke device pe rehta hai, humare
        server pe kabhi nahi bheja jaata, aur aap ise browser settings se anytime clear kar sakte hain.
      </p>
      <p>
        Hum aur humare advertising/analytics partners cookies ya similar technologies use kar sakte hain
        site performance samajhne aur relevant ads dikhane ke liye.
      </p>

      <h2>Analytics</h2>
      <p>
        Hum aggregated, anonymous analytics data (jaise page views, popular content) use kar sakte hain site
        improve karne ke liye. Ye data kisi individual user ko identify nahi karta.
      </p>

      <h2>Advertising</h2>
      <p>
        Ye site Google AdSense jaisi third-party advertising services use kar sakti hai. Ye services
        cookies ka use karke aapko relevant ads dikhati hain, aapki is site aur other sites par visit ke
        aadhar par. Aap Google&rsquo;s Ads Settings se personalized advertising opt-out kar sakte hain.
      </p>

      <h2>Third-Party Links</h2>
      <p>
        Humari site mein WhatsApp, Facebook, Telegram, X jaise third-party platforms ke share links hain. In
        platforms ki apni alag privacy policies hain, jinke liye hum responsible nahi hain.
      </p>

      <h2>Children&rsquo;s Privacy</h2>
      <p>
        Ye site sabhi umr ke users ke liye clean, family-friendly content provide karti hai, lekin ye
        specifically children ke liye design nahi ki gayi hai aur hum knowingly children se personal
        information collect nahi karte.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        Hum is policy ko samay-samay pe update kar sakte hain. Koi bhi changes is page par post kiye jaayenge.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy se related sawaal ke liye, <a href="/contact">Contact Us</a> page use kariye.
      </p>
    </LegalLayout>
  );
}
