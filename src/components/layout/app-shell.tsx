"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { CopilotPanel } from "@/components/copilot/copilot-panel";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onOpenCopilot={() => setCopilotOpen(true)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <CopilotPanel open={copilotOpen} onOpenChange={setCopilotOpen} />
    </div>
  );
}
