"use client";

import Link from "next/link";
import { useRef } from "react";

import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/icons";
import { brand, navigation } from "@/lib/catalog";

export function SiteHeader() {
  const drawerRef = useRef<HTMLDialogElement>(null);

  const openMenu = () => drawerRef.current?.showModal();
  const closeMenu = () => drawerRef.current?.close();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="container-bleed grid h-header grid-cols-[1fr_auto_1fr] items-center">
        {/* Left: menu + search */}
        <div className="flex items-center gap-1 -ml-2.5">
          <button
            type="button"
            onClick={openMenu}
            className="btn-icon hover:bg-surface-strong lg:hidden"
            aria-label="Open menu"
            aria-haspopup="dialog"
          >
            <MenuIcon />
          </button>
          <Link href="/search" className="btn-icon hover:bg-surface-strong" aria-label="Search">
            <SearchIcon />
          </Link>
        </div>

        {/* Center: wordmark */}
        <Link
          href="/"
          className="whitespace-nowrap font-serif text-lg uppercase tracking-[0.14em] sm:text-xl sm:tracking-[0.18em] md:text-2xl md:tracking-[0.22em]"
          aria-label={`${brand.name} home`}
        >
          {brand.name}
        </Link>

        {/* Right: account + bag */}
        <div className="-mr-2.5 flex items-center justify-end gap-1">
          <Link
            href="/account"
            className="btn-icon hidden hover:bg-surface-strong sm:inline-grid"
            aria-label="Account"
          >
            <UserIcon />
          </Link>
          <Link href="/cart" className="btn-icon relative hover:bg-surface-strong" aria-label="Shopping bag, 0 items">
            <BagIcon />
          </Link>
        </div>
      </div>

      {/* Desktop navigation row */}
      <nav aria-label="Primary" className="hidden lg:block">
        <ul className="flex items-center justify-center gap-10 pb-3">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="eyebrow link-quiet">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile drawer: native <dialog> gives focus trapping and Esc-to-close. */}
      <dialog
        ref={drawerRef}
        aria-label="Menu"
        onClick={(e) => e.target === e.currentTarget && closeMenu()}
        className="m-0 h-dvh max-h-none w-[min(24rem,88vw)] max-w-none bg-paper p-0 text-ink backdrop:bg-ink/40"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-header items-center justify-between border-b border-line px-gutter">
            <span className="eyebrow">Menu</span>
            <button
              type="button"
              onClick={closeMenu}
              className="btn-icon -mr-2.5 hover:bg-surface-strong"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-gutter py-6">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block py-3 text-lg uppercase hover:text-muted"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="divider space-y-3 px-gutter py-6">
            <Link href="/account" onClick={closeMenu} className="text-meta link-quiet flex items-center gap-3">
              <UserIcon width={16} height={16} /> My account
            </Link>
            <Link href="/contact" onClick={closeMenu} className="text-meta link-quiet block">
              Contact us
            </Link>
          </div>
        </div>
      </dialog>
    </header>
  );
}
