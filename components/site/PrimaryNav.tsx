"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/products/clothing", label: "Clothing" },
  { href: "/products/shoes", label: "Shoes & Footwear" },
  { href: "/products/bags", label: "Bags" },
  { href: "/products/fragrance", label: "Fragrance" },
  { href: "/#brands", label: "Brands" },
  { href: "/contact", label: "Contact" },
];

export function PrimaryNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (navRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Close the mobile panel whenever the route changes (link click navigated).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(href: string): boolean {
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <button
        type="button"
        ref={toggleRef}
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="primary-nav"
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-toggle__bar" />
        <span className="nav-toggle__bar" />
        <span className="nav-toggle__bar" />
      </button>

      <nav
        id="primary-nav"
        ref={navRef}
        className={`primary-nav${open ? " is-open" : ""}`}
        aria-label="Primary"
      >
        <ul className="primary-nav__list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`primary-nav__link${isActive(link.href) ? " is-active" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
