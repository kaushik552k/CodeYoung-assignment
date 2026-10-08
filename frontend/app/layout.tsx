import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeYoung — Book a Free Trial Class",
  description:
    "Book a free trial coding class with an expert CodeYoung mentor. Choose your preferred time and get started in minutes.",
  keywords: ["coding classes", "kids coding", "trial class", "CodeYoung", "mentors"],
  openGraph: {
    title: "CodeYoung — Book a Free Trial Class",
    description: "Book a free trial coding class with an expert mentor.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
