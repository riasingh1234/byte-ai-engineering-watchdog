import React, { useEffect, useState } from "react";
import {
  Radar,
  Search,
  Database,
  Scale,
  Sparkles,
  BrainCircuit,
  LayoutDashboard,
  Newspaper,
  GitPullRequestArrow,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------
 * MOCK DATA
 * Replace these with real fetches to your Express API, e.g.:
 *   GET /api/stats
 *   GET /api/pipeline/status
 *   GET /api/intelligence?limit=6
 * Keep the shapes below stable and the components won't need to change.
 * ---------------------------------------------------------------- */

const STATS = [
  { key: "discovered", label: "Topics Discovered", value: "1,284", delta: "+18 today", tone: "cyan", icon: Search },
  { key: "accepted", label: "Topics Accepted", value: "342", delta: "26.6% acceptance", tone: "green", icon: CheckCircle2 },
  { key: "rejected", label: "Topics Rejected", value: "942", delta: "73.4% filtered", tone: "red", icon: XCircle },
  { key: "memories", label: "Memories Stored", value: "3,591", delta: "+47 this week", tone: "amber", icon: Database },
];

const PIPELINE_STAGES = [
  { key: "discover", label: "Discover", icon: Search, status: "done", note: "212 sources polled" },
  { key: "retrieve", label: "Retrieve Memory", icon: Database, status: "done", note: "3,591 memories indexed" },
  { key: "evaluate", label: "Evaluate", icon: Scale, status: "active", note: "Scoring topic #1284" },
  { key: "generate", label: "Generate", icon: Sparkles, status: "pending", note: "Awaiting decision" },
  { key: "remember", label: "Remember", icon: BrainCircuit, status: "pending", note: "Awaiting output" },
];

const INTELLIGENCE_FEED = [
  {
    id: 1,
    title: "Anthropic publishes interpretability paper on feature circuits",
    summary:
      "New research traces how mid-size transformer models route multi-step reasoning through identifiable feature circuits, with reproducible probing code.",
    decision: "accepted",
    reason: "High technical depth, verified against 3 independent sources, directly relevant to engineering audience.",
    timestamp: "12 min ago",
    tag: "Research",
  },
  {
    id: 2,
    title: "Startup claims new benchmark shows 'AGI-level' reasoning",
    summary:
      "A seed-stage startup published a leaderboard result with no methodology section and no public eval harness.",
    decision: "rejected",
    reason: "Unverifiable claim, single low-credibility source, no reproducible benchmark artifact.",
    timestamp: "38 min ago",
    tag: "Benchmark",
  },
  {
    id: 3,
    title: "Open-weights model release adds speculative decoding support",
    summary:
      "Inference server update reports up to 2.3x throughput on long-context generation via draft-model speculative decoding.",
    decision: "accepted",
    reason: "Concrete engineering impact, benchmarked numbers included, matches watchlist keywords.",
    timestamp: "1h ago",
    tag: "Infra",
  },
  {
    id: 4,
    title: "Vector database vendor announces pricing change",
    summary:
      "Pricing page update shifts from per-query to per-namespace billing, no architectural or performance changes disclosed.",
    decision: "rejected",
    reason: "Commercial/pricing news, low signal for an engineering-focused brief.",
    timestamp: "2h ago",
    tag: "Product",
  },
  {
    id: 5,
    title: "New paper proposes memory-efficient attention variant",
    summary:
      "Preprint claims 40% KV-cache reduction with under 1% quality regression across three model sizes, code released.",
    decision: "accepted",
    reason: "Reproducible artifact, quantified tradeoffs, high relevance to inference-cost engineering.",
    timestamp: "4h ago",
    tag: "Research",
  },
  {
    id: 6,
    title: "Rumor thread speculates on next-gen model specs",
    summary:
      "Social media thread aggregates unconfirmed parameter counts and release dates attributed to anonymous sources.",
    decision: "rejected",
    reason: "Speculative, unverified, duplicate of similar rumor covered two days prior.",
    timestamp: "6h ago",
    tag: "Rumor",
  },
];

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "intelligence", label: "Intelligence", icon: Newspaper },
  { key: "memory", label: "Memory", icon: Database },
  { key: "decisions", label: "Decisions", icon: GitPullRequestArrow },
  { key: "settings", label: "Settings", icon: Settings },
];

/* ------------------------------------------------------------------
 * PRESENTATIONAL COMPONENTS
 * ---------------------------------------------------------------- */

function Logomark() {
  return (
    <svg className="byte-logomark" width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="15.5" stroke="var(--amber)" strokeWidth="1.4" opacity="0.35" />
      <circle cx="17" cy="17" r="10.5" stroke="var(--amber)" strokeWidth="1.4" opacity="0.6" />
      <circle cx="17" cy="17" r="3.2" fill="var(--amber)" className="byte-logomark-core" />
      <line x1="17" y1="17" x2="17" y2="3" stroke="var(--amber)" strokeWidth="1.4" className="byte-logomark-sweep" />
    </svg>
  );
}

function StatusIndicator() {
  return (
    <div className="byte-status">
      <span className="byte-status-dot" />
      <span className="byte-status-text">AGENT ACTIVE</span>
      <span className="byte-status-sub">· evaluating</span>
    </div>
  );
}

function Header({ onMenuToggle, menuOpen }) {
  return (
    <header className="byte-header">
      <div className="byte-header-left">
        <button className="byte-menu-btn" onClick={onMenuToggle} aria-label="Toggle navigation">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Logomark />
        <div className="byte-wordmark">
          <span className="byte-name">BYTE</span>
          <span className="byte-tagline">AI ENGINEERING WATCHDOG</span>
        </div>
      </div>
      <StatusIndicator />
    </header>
  );
}

function Sidebar({ active, onSelect, open }) {
  return (
    <nav className={`byte-sidebar ${open ? "byte-sidebar-open" : ""}`}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.key === active;
        return (
          <button
            key={item.key}
            className={`byte-nav-item ${isActive ? "byte-nav-item-active" : ""}`}
            onClick={() => onSelect(item.key)}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{item.label}</span>
            {isActive && <ChevronRight size={14} className="byte-nav-chevron" />}
          </button>
        );
      })}
    </nav>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div className={`byte-stat-card byte-tone-${stat.tone}`}>
      <div className="byte-stat-icon">
        <Icon size={18} strokeWidth={1.8} />
      </div>
      <div className="byte-stat-body">
        <span className="byte-stat-value">{stat.value}</span>
        <span className="byte-stat-label">{stat.label}</span>
        <span className="byte-stat-delta">{stat.delta}</span>
      </div>
    </div>
  );
}

function StatsGrid({ stats }) {
  return (
    <div className="byte-stats-grid">
      {stats.map((stat) => (
        <StatCard key={stat.key} stat={stat} />
      ))}
    </div>
  );
}

function PipelineStage({ stage, isLast }) {
  const Icon = stage.icon;
  return (
    <div className="byte-pipeline-stage">
      <div className={`byte-pipeline-node byte-pipeline-node-${stage.status}`}>
        <Icon size={17} strokeWidth={1.8} />
      </div>
      <span className="byte-pipeline-label">{stage.label}</span>
      <span className="byte-pipeline-note">{stage.note}</span>
      {!isLast && (
        <div className={`byte-pipeline-connector byte-pipeline-connector-${stage.status}`}>
          <span className="byte-pipeline-flow" />
        </div>
      )}
    </div>
  );
}

function AgentActivity() {
  return (
    <section className="byte-panel byte-activity">
      <div className="byte-panel-header">
        <h2>Agent Activity</h2>
        <span className="byte-panel-sub">live pipeline</span>
      </div>
      <div className="byte-pipeline">
        {PIPELINE_STAGES.map((stage, i) => (
          <PipelineStage key={stage.key} stage={stage} isLast={i === PIPELINE_STAGES.length - 1} />
        ))}
      </div>
    </section>
  );
}

function DecisionBadge({ decision }) {
  const isAccepted = decision === "accepted";
  const Icon = isAccepted ? CheckCircle2 : XCircle;
  return (
    <span className={`byte-badge ${isAccepted ? "byte-badge-accept" : "byte-badge-reject"}`}>
      <Icon size={13} strokeWidth={2} />
      {isAccepted ? "Accepted" : "Rejected"}
    </span>
  );
}

function IntelligenceCard({ item }) {
  return (
    <article className="byte-intel-card">
      <div className="byte-intel-top">
        <span className="byte-intel-tag">{item.tag}</span>
        <DecisionBadge decision={item.decision} />
      </div>
      <h3 className="byte-intel-title">{item.title}</h3>
      <p className="byte-intel-summary">{item.summary}</p>
      <div className="byte-intel-reason">
        <span className="byte-intel-reason-label">Reason</span>
        <p>{item.reason}</p>
      </div>
      <div className="byte-intel-footer">
        <Clock size={12} />
        <span>{item.timestamp}</span>
      </div>
    </article>
  );
}

function IntelligenceFeed() {
  return (
    <section className="byte-panel byte-feed">
      <div className="byte-panel-header">
        <h2>Latest Intelligence</h2>
        <span className="byte-panel-sub">{INTELLIGENCE_FEED.length} recent items</span>
      </div>
      <div className="byte-feed-grid">
        {INTELLIGENCE_FEED.map((item) => (
          <IntelligenceCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * ROOT COMPONENT
 * ---------------------------------------------------------------- */

export default function BYTEDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const [stats, setStats] = useState(STATS);
    useEffect(() => {
    fetch("https://supreme-space-rotary-phone-r4vj795gx6q35q9v-5000.app.github.dev/api/stats")
      .then((response) => response.json())
      .then((data) => {
        setStats((currentStats) =>
          currentStats.map((stat) => ({
            ...stat,
            value: data[stat.key].toLocaleString(),
          }))
        );
      })
      .catch((error) => {
        console.error("Stats API error:", error);
      });
  }, []);

  return (
    <div className="byte-app">
      <Header onMenuToggle={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} />
      <div className="byte-body">
        <Sidebar active={activeNav} onSelect={(key) => { setActiveNav(key); setMenuOpen(false); }} open={menuOpen} />
        <main className="byte-main">
          <StatsGrid stats={stats} />
          <AgentActivity />
          <IntelligenceFeed />
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .byte-app {
          --void: #0A0C10;
          --panel: #12151B;
          --panel-raised: #171B22;
          --border: #242A33;
          --text-primary: #E7EAF0;
          --text-secondary: #8891A0;
          --text-dim: #545C69;
          --amber: #FF9640;
          --cyan: #4FD8C7;
          --green: #46D98A;
          --red: #F0665F;

          background: var(--void);
          color: var(--text-primary);
          font-family: 'Inter', -apple-system, sans-serif;
          min-height: 100vh;
          width: 100%;
          background-image:
            radial-gradient(ellipse 900px 500px at 15% -10%, rgba(255,150,64,0.07), transparent),
            radial-gradient(ellipse 700px 500px at 100% 10%, rgba(79,216,199,0.06), transparent);
        }

        .byte-app * { box-sizing: border-box; }

        /* ---------- Header ---------- */
        .byte-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          border-bottom: 1px solid var(--border);
          background: rgba(18,21,27,0.75);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 20;
        }
        .byte-header-left { display: flex; align-items: center; gap: 12px; }
        .byte-menu-btn {
          display: none;
          background: none;
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-secondary);
          padding: 6px;
          cursor: pointer;
        }

        .byte-logomark-core { animation: byte-pulse-core 2.6s ease-in-out infinite; }
        .byte-logomark-sweep { transform-origin: 17px 17px; animation: byte-sweep 3.2s linear infinite; }
        @keyframes byte-pulse-core { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
        @keyframes byte-sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .byte-wordmark { display: flex; flex-direction: column; line-height: 1.15; }
        .byte-name {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 19px;
          letter-spacing: 0.5px;
        }
        .byte-tagline {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 1.6px;
          color: var(--cyan);
        }

        .byte-status { display: flex; align-items: center; gap: 7px; }
        .byte-status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 0 0 rgba(70,217,138,0.6);
          animation: byte-status-ping 2s ease-out infinite;
        }
        @keyframes byte-status-ping {
          0% { box-shadow: 0 0 0 0 rgba(70,217,138,0.55); }
          70% { box-shadow: 0 0 0 7px rgba(70,217,138,0); }
          100% { box-shadow: 0 0 0 0 rgba(70,217,138,0); }
        }
        .byte-status-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          color: var(--green);
          font-weight: 500;
        }
        .byte-status-sub { font-size: 11px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; }

        /* ---------- Body layout ---------- */
        .byte-body { display: grid; grid-template-columns: 224px 1fr; min-height: calc(100vh - 61px); }

        .byte-sidebar {
          border-right: 1px solid var(--border);
          padding: 18px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(18,21,27,0.4);
        }
        .byte-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s, color 0.15s;
        }
        .byte-nav-item:hover { background: var(--panel-raised); color: var(--text-primary); }
        .byte-nav-item-active {
          background: linear-gradient(90deg, rgba(255,150,64,0.14), rgba(255,150,64,0.02));
          color: var(--amber);
          border-left: 2px solid var(--amber);
          padding-left: 10px;
        }
        .byte-nav-chevron { margin-left: auto; }

        .byte-main {
          padding: 24px 28px 48px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1180px;
        }

        /* ---------- Stat cards ---------- */
        .byte-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .byte-stat-card {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          position: relative;
          overflow: hidden;
        }
        .byte-stat-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--accent);
          opacity: 0.7;
        }
        .byte-tone-cyan { --accent: var(--cyan); }
        .byte-tone-green { --accent: var(--green); }
        .byte-tone-red { --accent: var(--red); }
        .byte-tone-amber { --accent: var(--amber); }
        .byte-stat-icon {
          width: 34px; height: 34px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: color-mix(in srgb, var(--accent) 14%, transparent);
          color: var(--accent);
          flex-shrink: 0;
        }
        .byte-stat-body { display: flex; flex-direction: column; gap: 2px; }
        .byte-stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; }
        .byte-stat-label { font-size: 12px; color: var(--text-secondary); }
        .byte-stat-delta { font-size: 11px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; margin-top: 2px; }

        /* ---------- Panels ---------- */
        .byte-panel {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
        }
        .byte-panel-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .byte-panel-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 600;
          margin: 0;
        }
        .byte-panel-sub {
          font-size: 11px;
          color: var(--text-dim);
          font-family: 'JetBrains Mono', monospace;
        }

        /* ---------- Pipeline ---------- */
        .byte-pipeline {
          display: flex;
          align-items: flex-start;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .byte-pipeline-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          flex: 1;
          min-width: 110px;
        }
        .byte-pipeline-node {
          width: 42px; height: 42px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid var(--border);
          background: var(--panel-raised);
          color: var(--text-dim);
          margin-bottom: 8px;
          z-index: 2;
        }
        .byte-pipeline-node-done { border-color: var(--green); color: var(--green); }
        .byte-pipeline-node-active {
          border-color: var(--amber); color: var(--amber);
          box-shadow: 0 0 0 4px rgba(255,150,64,0.12);
          animation: byte-node-breathe 1.8s ease-in-out infinite;
        }
        @keyframes byte-node-breathe {
          0%,100% { box-shadow: 0 0 0 4px rgba(255,150,64,0.12); }
          50% { box-shadow: 0 0 0 7px rgba(255,150,64,0.05); }
        }
        .byte-pipeline-node-pending { color: var(--text-dim); }
        .byte-pipeline-label { font-size: 12.5px; font-weight: 600; color: var(--text-primary); }
        .byte-pipeline-note { font-size: 10.5px; color: var(--text-dim); margin-top: 3px; max-width: 110px; font-family: 'JetBrains Mono', monospace; }

        .byte-pipeline-connector {
          position: absolute;
          top: 21px;
          left: calc(50% + 30px);
          right: calc(-50% + 30px);
          height: 1.5px;
          background: var(--border);
          overflow: hidden;
        }
        .byte-pipeline-connector-done { background: rgba(70,217,138,0.35); }
        .byte-pipeline-flow {
          position: absolute;
          top: -1.5px;
          left: -20%;
          width: 20%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--amber), transparent);
          animation: byte-flow 2.4s linear infinite;
          opacity: 0.9;
        }
        @keyframes byte-flow {
          from { left: -20%; }
          to { left: 100%; }
        }

        /* ---------- Intelligence feed ---------- */
        .byte-feed-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .byte-intel-card {
          background: var(--panel-raised);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: border-color 0.15s;
        }
        .byte-intel-card:hover { border-color: color-mix(in srgb, var(--amber) 40%, var(--border)); }
        .byte-intel-top { display: flex; align-items: center; justify-content: space-between; }
        .byte-intel-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          color: var(--text-dim);
          border: 1px solid var(--border);
          border-radius: 5px;
          padding: 2px 7px;
          text-transform: uppercase;
        }
        .byte-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 20px;
        }
        .byte-badge-accept { background: rgba(70,217,138,0.12); color: var(--green); }
        .byte-badge-reject { background: rgba(240,102,95,0.12); color: var(--red); }

        .byte-intel-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14.5px;
          font-weight: 600;
          margin: 0;
          line-height: 1.35;
        }
        .byte-intel-summary { font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; margin: 0; }
        .byte-intel-reason {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px 10px;
        }
        .byte-intel-reason-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 1px;
          color: var(--text-dim);
          text-transform: uppercase;
        }
        .byte-intel-reason p { font-size: 12px; color: var(--text-secondary); margin: 4px 0 0; line-height: 1.45; }
        .byte-intel-footer {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: var(--text-dim);
          font-family: 'JetBrains Mono', monospace;
          margin-top: 2px;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 860px) {
          .byte-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .byte-feed-grid { grid-template-columns: 1fr; }
          .byte-body { grid-template-columns: 1fr; }
          .byte-menu-btn { display: inline-flex; }
          .byte-sidebar {
            position: fixed;
            top: 61px; left: 0; bottom: 0;
            width: 220px;
            transform: translateX(-100%);
            transition: transform 0.2s ease;
            z-index: 30;
            background: var(--void);
          }
          .byte-sidebar-open { transform: translateX(0); }
          .byte-pipeline { flex-direction: column; align-items: stretch; gap: 18px; }
          .byte-pipeline-stage { flex-direction: row; text-align: left; gap: 10px; min-width: 0; }
          .byte-pipeline-node { margin-bottom: 0; flex-shrink: 0; }
          .byte-pipeline-note { max-width: none; }
          .byte-pipeline-connector { display: none; }
        }
        @media (max-width: 520px) {
          .byte-stats-grid { grid-template-columns: 1fr; }
          .byte-header { padding: 12px 16px; }
          .byte-main { padding: 18px 16px 36px; }
          .byte-status-sub { display: none; }
        }
      `}</style>
    </div>
  );
}
