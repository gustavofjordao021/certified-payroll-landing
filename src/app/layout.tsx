import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wh347form.com"),
  title: "WH347form.com — certified payroll, filed from the payroll you already ran",
  description:
    "Free WH-347 generator plus automated certified payroll: upload your payroll report and get your WH-347 and California DIR forms back in minutes.",
  openGraph: {
    title: "Free WH-347 certified payroll generator",
    description:
      "Create a WH-347 certified payroll report in your browser — no signup, nothing uploaded. Automated weekly filings coming soon.",
    url: "https://wh347form.com",
    siteName: "WH347form.com",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
