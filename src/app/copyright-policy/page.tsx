import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Copyright Policy",
  description: `${siteConfig.name} ki Copyright Policy — content ownership aur takedown request process.`,
  path: "/copyright-policy",
});

export default function CopyrightPolicyPage() {
  return (
    <LegalLayout title="Copyright Policy" path="/copyright-policy" updated="20 September 2026">
      <p>
        Is site par saare jokes, meme images, wishes aur status text {siteConfig.name} team dwara original
        roop se likhe aur generate kiye gaye hain. Hum kisi bhi scraped ya copyrighted third-party image ko
        publish nahi karte — humari meme images procedurally, in-house design ki gayi hain.
      </p>

      <h2>Ownership</h2>
      <p>
        Is site ka design, branding, aur original content {siteConfig.name} ka intellectual property hai.
        Jokes aur memes personal, non-commercial sharing ke liye free hain, lekin bulk republishing ya
        commercial use ke liye permission chahiye.
      </p>

      <h2>Copyright Concern?</h2>
      <p>
        Agar aapko lagta hai ki humare kisi content ne aapke copyright ka ullanghan kiya hai, please humein{" "}
        <a href="/contact">Contact Us</a> page se detail ke saath batayein:
      </p>
      <ul>
        <li>Content ka URL jiska aap reference kar rahe hain</li>
        <li>Aapka copyright claim ka proof/description</li>
        <li>Aapki contact information</li>
      </ul>
      <p>Hum genuine copyright concerns ko promptly review aur resolve karenge.</p>
    </LegalLayout>
  );
}
