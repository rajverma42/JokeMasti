import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer",
  description: `${siteConfig.name} par mil rahe content ke baare mein disclaimer.`,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer" path="/disclaimer" updated="20 September 2026">
      <p>
        {siteConfig.name} par diya gaya saara content — jokes, memes, images, status aur shayari — sirf
        <strong> entertainment purpose</strong> ke liye hai.
      </p>

      <h2>Humor &amp; Satire</h2>
      <p>
        Yahan ke jokes aur memes halke-fulke andaaz mein likhe gaye hain aur kisi bhi individual, community,
        religion, gender, profession ya organization ko target ya offend karne ka irada nahi rakhte. Agar
        koi content aapko offensive lagta hai, please humein turant <a href="/contact">batayein</a>.
      </p>

      <h2>No Professional Advice</h2>
      <p>
        Is site par diya gaya content legal, medical, financial ya kisi bhi professional advice ke roop mein
        na liya jaaye.
      </p>

      <h2>External Links</h2>
      <p>
        Share buttons WhatsApp, Facebook, Telegram aur X jaise third-party platforms par le jaate hain. Hum
        in platforms ke content ya practices ke liye responsible nahi hain.
      </p>

      <h2>Accuracy</h2>
      <p>
        Hum content ko accurate aur up-to-date rakhne ki koshish karte hain, lekin koi guarantee nahi dete.
        Site aur content &ldquo;as is&rdquo; basis pe provide kiya jaata hai.
      </p>
    </LegalLayout>
  );
}
