import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/ContactSection";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="section" aria-labelledby="contact-heading">
      <div className="container">
        <div className="section__header">
          <span className="section__eyebrow">Get In Touch</span>
          <h1 id="contact-heading">Contact Us</h1>
          <p className="section__lede">
            Questions about an order or a piece you&apos;ve seen? Send us a message.
          </p>
        </div>
        <ContactSection />
      </div>
    </section>
  );
}
