import { SITE_CONTACT } from "@/lib/site-config";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <div className="contact-layout">
      <div className="contact-info">
        <dl>
          <div className="contact-info__item">
            <dt>Location</dt>
            <dd>{SITE_CONTACT.location}</dd>
          </div>
          <div className="contact-info__item">
            <dt>Phone / WhatsApp</dt>
            <dd>
              <a href={`tel:+${SITE_CONTACT.phoneHref}`}>{SITE_CONTACT.phoneDisplay}</a>
            </dd>
          </div>
          <div className="contact-info__item">
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>
            </dd>
          </div>
          <div className="contact-info__item">
            <dt>Instagram</dt>
            <dd>
              <a href={SITE_CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer">
                {SITE_CONTACT.instagramHandle}
              </a>
              <span className="contact-info__note">{SITE_CONTACT.instagramNote}</span>
            </dd>
          </div>
          <div className="contact-info__item">
            <dt>Hours</dt>
            <dd>{SITE_CONTACT.hours}</dd>
          </div>
        </dl>
      </div>

      <ContactForm />
    </div>
  );
}
