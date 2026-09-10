import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Total Bellas GH's vision and mission — curated U.K. high street fashion for style-conscious shoppers in Ghana.",
};

export default function AboutPage() {
  return (
    <section className="section" aria-labelledby="about-heading">
      <div className="container">
        <div className="section__header">
          <span className="section__eyebrow">About Us</span>
          <h1 id="about-heading">Vision &amp; Mission</h1>
        </div>

        <article className="conduct-body">
          <section id="vision-mission" className="conduct-block">
            <h2>Our Mission</h2>
            <p>
              To offer a carefully curated selection of U.K. high street fashion, delivering
              quality, affordability, and exceptional customer service to style-conscious shoppers
              and fashion lovers in Ghana.
            </p>
          </section>
        </article>
      </div>
    </section>
  );
}
