import Image from "next/image";
import Link from "next/link";
import { getProductsByCategory, toCardData } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { BrandGrid } from "@/components/product/BrandGrid";
import { ContactSection } from "@/components/contact/ContactSection";

// Product data (and stock levels) changes via the admin panel; render fresh
// on every request rather than statically at build time.
export const dynamic = "force-dynamic";

const PREVIEW_LIMIT = 8;

export default async function HomePage() {
  const [clothing, shoes, bags, fragrance] = await Promise.all([
    getProductsByCategory("CLOTHING", PREVIEW_LIMIT),
    getProductsByCategory("SHOES", PREVIEW_LIMIT),
    getProductsByCategory("BAGS", PREVIEW_LIMIT),
    getProductsByCategory("FRAGRANCE", PREVIEW_LIMIT),
  ]);

  return (
    <>
      <section id="order" className="hero" aria-labelledby="order-heading">
        <div className="hero__media">
          <Image
            src="/hero/hero-image.png"
            alt="Two women walking together in the city, one in a pink blazer with jeans carrying an orange bag, the other in a black dress carrying a black handbag"
            width={1024}
            height={1536}
            priority
          />
        </div>
        <div className="hero__content">
          <p className="hero__eyebrow">New Season Edit</p>
          <h1 id="order-heading" className="hero__title">
            Effortless Style, Elevated
          </h1>
          <p className="hero__tagline">
            Curated U.K. high street fashion for the modern Ghanaian woman — because you deserve
            to wear your best moments.
          </p>
          <a className="btn btn-outline" href="#clothing">
            Shop The Collection
          </a>
        </div>
      </section>

      <section id="clothing" className="section" aria-labelledby="clothing-heading">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">Category</span>
            <h2 id="clothing-heading">Clothing</h2>
            <p className="section__lede">
              Wardrobe staples and statement pieces, cut for everyday elegance.
            </p>
          </div>
          <ProductGrid products={clothing.map(toCardData)} />
          <p className="section__view-all">
            <Link href="/products/clothing">View all Clothing →</Link>
          </p>
        </div>
      </section>

      <section id="shoes" className="section section--light" aria-labelledby="shoes-heading">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">Category</span>
            <h2 id="shoes-heading">Shoes &amp; Footwear</h2>
            <p className="section__lede">
              From everyday flats to statement heels, footwear built to finish every look.
            </p>
          </div>
          <ProductGrid products={shoes.map(toCardData)} />
          <p className="section__view-all">
            <Link href="/products/shoes">View all Shoes &amp; Footwear →</Link>
          </p>
        </div>
      </section>

      <section id="bags" className="section" aria-labelledby="bags-heading">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">Category</span>
            <h2 id="bags-heading">Bags</h2>
            <p className="section__lede">
              Totes, crossbody bags and clutches designed to carry it all, beautifully.
            </p>
          </div>
          <ProductGrid products={bags.map(toCardData)} />
          <p className="section__view-all">
            <Link href="/products/bags">View all Bags →</Link>
          </p>
        </div>
      </section>

      <section id="fragrance" className="section section--light" aria-labelledby="fragrance-heading">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">Category</span>
            <h2 id="fragrance-heading">Fragrance</h2>
            <p className="section__lede">A curated fragrance edit, available in-store and by request.</p>
          </div>
          <ProductGrid products={fragrance.map(toCardData)} single={fragrance.length === 1} />
        </div>
      </section>

      <section id="brands" className="section section--light" aria-labelledby="brands-heading">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">Stockists</span>
            <h2 id="brands-heading">Brands We Carry</h2>
            <p className="section__lede">
              A curated edit of U.K. high street labels chosen for quality, craft and lasting style.
            </p>
          </div>
          <BrandGrid />
        </div>
      </section>

      <section id="contact" className="section" aria-labelledby="contact-heading">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">Get In Touch</span>
            <h2 id="contact-heading">Contact Us</h2>
            <p className="section__lede">
              Questions about an order or a piece you&apos;ve seen? Send us a message.
            </p>
          </div>
          <ContactSection />
        </div>
      </section>
    </>
  );
}
