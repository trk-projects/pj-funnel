import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PJ Home Care — Free Quote | Sugar Land Pressure & Window Washing",
  description:
    "Get a free instant quote for pressure washing and window cleaning in Sugar Land, Houston, Katy and surrounding areas. Student-owned local business serving homeowners since 2021.",
  keywords: "pressure washing Sugar Land, window washing Houston, home cleaning Katy, PJ Home Care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
