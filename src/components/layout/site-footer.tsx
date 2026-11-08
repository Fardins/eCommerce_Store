import Link from "next/link";

import { brand, footerLinks } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-page section">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-xs space-y-4 sm:col-span-3 lg:col-span-1">
            <p className="whitespace-nowrap font-serif text-2xl uppercase tracking-[0.2em]">{brand.name}</p>
            <p className="text-meta text-paper/70">{brand.tagline}</p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h2 className="eyebrow mb-4">{group.title}</h2>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-meta link-quiet text-paper/70 hover:text-paper">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-paper/20 pt-6 text-2xs text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>United States · English · USD</p>
          <p>© 2026 {brand.name}. Sample storefront.</p>
        </div>
      </div>
    </footer>
  );
}
