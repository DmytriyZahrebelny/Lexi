import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "../providers/AppProviders";

export const metadata: Metadata = {
  title: "Lexi",
  description: "Learn English vocabulary with spaced repetition.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
