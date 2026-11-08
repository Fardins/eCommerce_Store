import { announcement } from "@/lib/catalog";

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-paper">
      <p className="container-page text-2xs flex min-h-8 items-center justify-center py-2 text-center uppercase tracking-caps">
        {announcement}
      </p>
    </div>
  );
}
