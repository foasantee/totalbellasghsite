import Link from "next/link";
import { SITE_CONTACT } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__col site-footer__col--brand">
            <p className="site-footer__brand">Total Bellas GH</p>
            <p>🎀 Wear your best moments 🎀</p>
            <p>U.K. high street fashion — Accra, Ghana.</p>
          </div>

          <div className="site-footer__col">
            <h3 className="site-footer__heading">Shop</h3>
            <ul className="site-footer__links">
              <li><Link href="/products/clothing">Clothing</Link></li>
              <li><Link href="/products/shoes">Shoes &amp; Footwear</Link></li>
              <li><Link href="/products/bags">Bags</Link></li>
              <li><Link href="/products/fragrance">Fragrance</Link></li>
              <li><Link href="/#brands">Brands</Link></li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h3 className="site-footer__heading">About</h3>
            <ul className="site-footer__links">
              <li><Link href="/social-code-of-conduct">Social Code of Conduct</Link></li>
              <li><Link href="/about#vision-mission">Vision &amp; Mission</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h3 className="site-footer__heading">Policies</h3>
            <ul className="site-footer__links">
              <li><Link href="/policies#disclaimer">Disclaimer</Link></li>
              <li><Link href="/policies#delivery">Delivery Terms</Link></li>
              <li><Link href="/policies#payment">Payment Terms</Link></li>
              <li><Link href="/policies#exchanges">Exchanges &amp; Refunds</Link></li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h3 className="site-footer__heading">Follow Us</h3>
            <ul className="site-footer__links">
              <li>
                <a href={SITE_CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer">
                  Instagram<span className="site-footer__external" aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href={SITE_CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  WhatsApp<span className="site-footer__external" aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <p>&copy; {new Date().getFullYear()} Total Bellas GH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
