import type { ReactNode } from "react";

export const metadata = {
  title: "VAsync Scheduling",
  description: "Register collab availability for the VAsync guild.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0b0b10", color: "#eee" }}>
        {children}
      </body>
    </html>
  );
}
