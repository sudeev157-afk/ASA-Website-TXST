import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASA - Association for Statistics and Analytics | Texas State University",
  description:
    "The Association for Statistics and Analytics at Texas State University — empowering students through data-driven insight, analytics workshops, and community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
