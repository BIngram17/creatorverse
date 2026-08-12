import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import { headers } from "next/headers";
import "@picocss/pico/css/pico.min.css";
import "./globals.css";

const display = Syne({ variable: "--font-display", subsets: ["latin"] });
const body = Space_Grotesk({ variable: "--font-body", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  return {
    metadataBase: base,
    title: "Creatorverse — Creators worth your attention",
    description: "A hand-picked field guide to the internet's most inventive creators.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "Creatorverse — Curate your corner of the internet.",
      description: "A hand-picked field guide to people making the web more curious, useful, and alive.",
      images: [{ url: new URL("/og.png", base).toString(), width: 1728, height: 910, alt: "Creatorverse — Good internet. Found here." }],
      type: "website",
    },
    twitter: { card: "summary_large_image", images: [new URL("/og.png", base).toString()] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
