import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";

type SectionHeaderProps = {
  id: string;
  eyebrow?: string;
  title: string;
  action?: { label: string; href: string };
};

export function SectionHeader({ id, eyebrow, title, action }: SectionHeaderProps) {
  return (
    <div className="container-bleed mb-6 flex items-end justify-between gap-6 md:mb-8">
      <div className="space-y-2">
        {eyebrow && <p className="eyebrow text-muted">{eyebrow}</p>}
        <h2 id={id} className="heading-page">
          {title}
        </h2>
      </div>
      {action && (
        <Link href={action.href} className="eyebrow link-quiet flex shrink-0 items-center gap-2">
          {action.label}
          <ArrowRightIcon width={14} height={14} />
        </Link>
      )}
    </div>
  );
}
