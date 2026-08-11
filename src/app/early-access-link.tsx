"use client";

import { track } from "@/lib/analytics";

export function EarlyAccessLink({ source, children, className }: { source: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      className={className}
      href={`mailto:hello@wh347form.com?subject=Early access`}
      onClick={() => track("early_access_clicked", { source })}
    >
      {children}
    </a>
  );
}
