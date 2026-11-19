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
            alt="Total Bellas Gh"
            width={800}
            height={521}
            priority
          />
        </Link>

        <PrimaryNav />
      </div>
    </header>
  );
}
