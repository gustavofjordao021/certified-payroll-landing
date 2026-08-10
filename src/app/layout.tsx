import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WH347form.com — certified payroll, filed from the payroll you already ran",
  description:
    "Free WH-347 generator plus automated certified payroll: upload your payroll report and get your WH-347 and California DIR forms back in minutes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
