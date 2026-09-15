import type { ReactNode } from "react";

import "@/app/globals.css";

export const metadata = {
  title: "VAsync Scheduling",
  description: "Register collab availability for the VAsync guild.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
