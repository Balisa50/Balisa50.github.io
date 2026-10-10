import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Newsreader } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/components/SkipLink";
import { PROFILE } from "@/lib/projects";

// Display face. A serif carries the editorial register the layout is going
// for, and Newsreader holds up at large sizes without the fussiness Playfair
// (what the generator suggested) brings to a screen. Body stays on Geist Sans:
// a display serif at paragraph length is a readability problem, not a style.
const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const description =
  "Data science student in The Gambia. I work on retrieval and forecasting systems, and on the checks around them: RAG pipelines, applied NLP, and statistical modelling.";

export const metadata: Metadata = {
  metadataBase: new URL("https://balisa50.github.io"),
  title: {
    default: `${PROFILE.fullName} · ${PROFILE.title}`,
    template: `%s · ${PROFILE.fullName}`
  },
  description,
  keywords: [
    "Abdoulie Balisa",
    "AI Systems Developer",
    "Data Science Student",
    "Aspiring Actuary",
    "LLM",
    "TypeScript",
    "Python",
    "Next.js",
    "Portfolio"
  ],
  authors: [{ name: PROFILE.fullName, url: PROFILE.github }],
  creator: PROFILE.fullName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://balisa50.github.io",
    siteName: `${PROFILE.fullName} · ${PROFILE.title}`,
    title: `${PROFILE.fullName} · ${PROFILE.title}`,
    description
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.fullName} · ${PROFILE.title}`,
    description,
    creator: `@${PROFILE.githubHandle}`
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export const viewport: Viewport = {
  themeColor: "#fafaf9",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Runs before React hydrates. Reads the stored theme, or falls back to
          the OS setting on first visit, and applies the attribute on <html>
          before the first paint. Without this the page always renders in
          light and then snaps to dark a frame later, which is the flash users
          notice on every navigation.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var t=localStorage.getItem("theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;if(t==="dark"||(!t&&d)){document.documentElement.setAttribute("data-theme","dark");}}catch(e){}})();',
          }}
        />
      </head>
      <body className="bg-background font-sans text-text antialiased">
        <SkipLink />
        {children}

        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && location.protocol === 'https:') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(){});
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
