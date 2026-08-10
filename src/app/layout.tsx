import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FormFriday — certified payroll, filed from the payroll you already ran",
  description:
    "Upload your payroll report. Get your WH-347 and California DIR forms back in minutes — no re-typing hours, no switching payroll systems.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
