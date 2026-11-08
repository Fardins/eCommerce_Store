import type { ReactNode } from "react";

type AccordionItem = {
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
};

/** Native <details> disclosure list: keyboard and screen-reader support for free. */
export function ProductAccordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="border-b border-line">
      {items.map((item) => (
        <details key={item.title} open={item.defaultOpen} className="group border-t border-line">
          <summary className="eyebrow flex cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden">
            {item.title}
            <span
              aria-hidden="true"
              className="relative h-3 w-3 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-current after:transition-transform group-open:after:scale-y-0"
            />
          </summary>
          <div className="text-meta pb-5 text-muted">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
