import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Code of Conduct",
  description:
    "Total Bellas GH's social code of conduct — our guidelines for a kind, respectful and inclusive community across our social channels.",
};

export default function SocialCodeOfConductPage() {
  return (
    <section className="section" aria-labelledby="conduct-heading">
      <div className="container">
        <div className="section__header">
          <span className="section__eyebrow">Our Community</span>
          <h1 id="conduct-heading">Social Code of Conduct</h1>
          <p className="section__lede">
            Guidelines for a kind, respectful and inclusive community across our social channels.
          </p>
        </div>

        <article className="conduct-body">
          <section className="conduct-block">
            <h2>💬 Our Promise</h2>
            <p>
              Total Bellas GH is more than an online fashion store — it&apos;s a community built on
              confidence, creativity, and respect. We&apos;re proud to bring U.K. high street fashion
              to women across Ghana, and we want our social spaces to reflect the same elegance
              and positivity that define our brand.
            </p>
          </section>

          <section className="conduct-block">
            <h2>🌸 Our Social Spaces</h2>
            <p>
              We love seeing your style, hearing your stories, and sharing fashion inspiration. Our
              social channels are open to everyone who wants to connect, celebrate individuality,
              and enjoy fashion responsibly.
            </p>
          </section>

          <section className="conduct-block">
            <h2>📜 Our Guidelines</h2>
            <p>To keep our community safe and welcoming, we ask everyone to follow these simple rules:</p>
            <ul className="conduct-list">
              <li>Be kind, respectful, and inclusive — fashion is for everyone.</li>
              <li>
                Avoid posting or sharing anything that is:
                <ul className="conduct-list conduct-list--nested">
                  <li>Offensive, abusive, or discriminatory</li>
                  <li>Misleading or false</li>
                  <li>Spam or promotional content unrelated to Total Bellas GH</li>
                  <li>In violation of any law or intellectual property rights</li>
                </ul>
              </li>
              <li>Do not impersonate Total Bellas GH or use our imagery, logo, or content without permission.</li>
              <li>We reserve the right to hide, block, or report users who breach these guidelines.</li>
            </ul>
          </section>

          <section className="conduct-block">
            <h2>💌 How We Engage</h2>
            <p>
              Our social and customer care teams are here to help and celebrate your style. We aim
              to respond promptly during business hours:
            </p>
            <ul className="conduct-list">
              <li>Monday–Friday: 9 AM – 8 PM</li>
              <li>Saturday: 10 AM – 5 PM</li>
              <li>Sunday: 11 AM – 5 PM</li>
            </ul>
            <p>Messages sent outside these hours will be handled as soon as possible when we&apos;re back online.</p>
          </section>

          <section className="conduct-block">
            <h2>🔄 Updates</h2>
            <p>We may update this Social Code of Conduct occasionally to reflect new community standards or platform changes.</p>
          </section>

          <section className="conduct-block">
            <h2>💕 Final Word</h2>
            <p>
              Total Bellas GH stands for empowerment, respect, and style. Let&apos;s make our online
              spaces as inspiring and beautiful as the fashion we share — together.
            </p>
          </section>
        </article>
      </div>
    </section>
  );
}
