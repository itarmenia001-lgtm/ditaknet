import { Activity, Camera, Router, Server, Shield, Wifi } from "lucide-react";

type HeroShowcaseProps = {
  title: string;
  subtitle: string;
};

export function HeroShowcase({ title, subtitle }: HeroShowcaseProps) {
  const nodes = [
    { icon: Router, label: "Router", tone: "ok" },
    { icon: Camera, label: "NVR", tone: "warn" },
    { icon: Server, label: "Server", tone: "ok" },
    { icon: Wifi, label: "VLAN", tone: "ok" }
  ] as const;

  return (
    <div className="hero-showcase fade-in-up">
      <div className="hero-showcase-glow" aria-hidden="true" />
      <div className="hero-showcase-panel">
        <div className="hero-showcase-top">
          <div>
            <p className="hero-showcase-eyebrow">{title}</p>
            <p className="hero-showcase-title">{subtitle}</p>
          </div>
          <Shield className="h-8 w-8 text-[#7fd4bc]" aria-hidden="true" />
        </div>

        <div className="hero-showcase-stats">
          {[
            ["128", "Online"],
            ["7", "Warnings"],
            ["1", "Offline"]
          ].map(([value, label]) => (
            <div key={label} className="hero-showcase-stat">
              <p className="hero-showcase-stat-value">{value}</p>
              <p className="hero-showcase-stat-label">{label}</p>
            </div>
          ))}
        </div>

        <div className="hero-showcase-map">
          <div className="hero-showcase-map-line hero-showcase-map-line--a" aria-hidden="true" />
          <div className="hero-showcase-map-line hero-showcase-map-line--b" aria-hidden="true" />
          <div className="hero-showcase-map-line hero-showcase-map-line--c" aria-hidden="true" />
          {nodes.map((node) => (
            <div key={node.label} className={`hero-showcase-node hero-showcase-node--${node.tone}`}>
              <node.icon className="h-4 w-4" aria-hidden="true" />
              <span>{node.label}</span>
            </div>
          ))}
          <div className="hero-showcase-core">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
