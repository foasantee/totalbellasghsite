import Image from "next/image";
import Link from "next/link";
import { PrimaryNav } from "./PrimaryNav";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="site-logo" href="/">
          <Image
            className="site-logo__image"
            src="/logo/total-bellas-logo-header.png"
            alt=""
            width={800}
            height={521}
            priority
          />
          <span className="site-logo__text-group">
            <span className="site-logo__text">Total Bellas Gh</span>
            <span className="site-logo__tagline">
              wear your best moments
              <svg
                className="site-logo__tagline-bow"
                viewBox="0 0 24 16"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M2 2.5 L11 8 L2 13.5 Z" />
                <path d="M22 2.5 L13 8 L22 13.5 Z" />
                <rect x="10" y="6" width="4" height="4" rx="1" />
              </svg>
            </span>
          </span>
        </Link>

        <PrimaryNav />
      </div>
    </header>
  );
}
