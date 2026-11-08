import { services } from "@/lib/catalog";

export function Services() {
  return (
    <section aria-labelledby="services-title" className="divider">
      <div className="container-page section">
        <h2 id="services-title" className="heading-section mb-10 text-center">
          The house services
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
          {services.map((service) => (
            <li key={service.title} className="space-y-2 text-center lg:px-8">
              <h3 className="eyebrow">{service.title}</h3>
              <p className="text-meta mx-auto max-w-60 text-muted">{service.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
