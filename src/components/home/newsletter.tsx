"use client";

import { useState } from "react";

// UI only: no request is sent yet. Wire to an email provider later.
export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section aria-labelledby="newsletter-title" className="bg-surface">
      <div className="container-narrow section text-center">
        <h2 id="newsletter-title" className="heading-section">
          Letters from the house
        </h2>
        <p className="text-meta mx-auto mt-3 max-w-sm text-muted">
          New collections, private appointments and stories from the workshop, sent occasionally.
        </p>

        {submitted ? (
          <p role="status" className="mt-8 text-sm">
            Thank you. You’re on the list.
          </p>
        ) : (
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:gap-0"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="Email address"
              className="h-12 min-w-0 flex-1 border border-ink bg-paper px-4 text-sm outline-none focus-visible:outline-offset-0 sm:border-r-0"
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
