"use client";

import { useEffect } from "react";

// /projects is what people try first. The work lives at /work.
// Static export blocks a server redirect, so this is a client one.
export default function ProjectsPage() {
  useEffect(() => {
    window.location.replace("/work/");
  }, []);

  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/work/" />
      <link rel="canonical" href="https://balisa50.github.io/work/" />
      <main className="mx-auto w-full max-w-shell px-6 py-32 sm:px-10">
        <p className="text-text-secondary">
          Redirecting to{" "}
          <a href="/work/" className="text-ink link-underline">
            the work
          </a>
          .
        </p>
      </main>
    </>
  );
}