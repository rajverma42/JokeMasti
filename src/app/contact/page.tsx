import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { ContactForm } from "@/components/ContactForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: "JokeMasti team se contact kariye — sawaal, feedback ya content suggestion ke liye.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <LegalLayout title="Contact Us" path="/contact">
      <p>
        Koi sawaal, feedback, content suggestion ya copyright concern hai? Neeche diya form bhariye, ya
        direct email kariye: <a href="mailto:hello@jokemasti.in">hello@jokemasti.in</a>
      </p>
      <div className="mt-2">
        <ContactForm />
      </div>
    </LegalLayout>
  );
}
