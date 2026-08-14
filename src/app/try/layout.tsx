import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload a Payroll Report, Get a WH-347 (AI Extraction Beta)",
  description:
    "Upload a payroll register, journal, or crew timesheet PDF. Two independent AI reads extract every worker row, cross-checked and flagged for review — then open the result in the free WH-347 generator.",
  alternates: { canonical: "https://www.wh347form.com/try" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
