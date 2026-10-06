import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algorithm Visualizer",
  description: "Staff-Level Algorithmic Visualizer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
