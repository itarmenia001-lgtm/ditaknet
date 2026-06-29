import { Activity, Bell, Camera, HardDrive, Network, Router } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function DashboardPreview({
  labels,
  brandName = "DitakNet"
}: {
  labels: {
    title: string;
    healthy: string;
    warnings: string;
    offline: string;
    discovery: string;
    topology: string;
    alerts: string;
  };
  brandName?: string;
}) {
  const rows = [
    { icon: Router, name: "Core router", status: labels.healthy, tone: "green" as const, value: "12 ms" },
    { icon: Camera, name: "NVR cameras", status: labels.warnings, tone: "amber" as const, value: "2 alerts" },
    { icon: HardDrive, name: "NAS storage", status: labels.healthy, tone: "green" as const, value: "71%" },
    { icon: Network, name: "Guest VLAN", status: labels.offline, tone: "red" as const, value: "1 host" }
  ];

  return (
    <div className="rounded-lg border border-[#cad9df] bg-[#fdfefe] p-3 shadow-[var(--shadow)]">
      <div className="rounded-md border border-[var(--line)] bg-[#10202d] p-4 text-white">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-[#a8c4d6]">{labels.title}</p>
            <p className="text-xl font-bold">{brandName}</p>
          </div>
          <Badge tone="green">{labels.discovery}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[labels.healthy, labels.warnings, labels.offline].map((label, index) => (
            <div key={label} className="rounded-md bg-white/8 p-3">
              <p className="text-xs text-[#a8c4d6]">{label}</p>
              <p className="mt-1 text-2xl font-bold">{[128, 7, 1][index]}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border border-[var(--line)] bg-white p-3">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold">
            <Activity className="h-4 w-4 text-[var(--brand)]" />
            {labels.topology}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {rows.map((row) => (
              <div key={row.name} className="rounded-md border border-[var(--line)] p-3">
                <div className="flex items-center gap-2">
                  <row.icon className="h-4 w-4 text-[var(--brand)]" />
                  <span className="truncate text-sm font-semibold">{row.name}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <Badge tone={row.tone}>{row.status}</Badge>
                  <span className="text-xs text-[var(--muted)]">{row.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-[var(--line)] bg-white p-3">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold">
            <Bell className="h-4 w-4 text-[var(--accent)]" />
            {labels.alerts}
          </div>
          <div className="space-y-2 text-sm">
            <p className="rounded-md bg-[#fff8e7] p-2 text-[#7a5200]">Camera group latency spike</p>
            <p className="rounded-md bg-[#edf7ff] p-2 text-[#135b94]">Docker agent heartbeat OK</p>
            <p className="rounded-md bg-[#ecfbf4] p-2 text-[#117a58]">Telegram notification delivered</p>
          </div>
        </div>
      </div>
    </div>
  );
}
