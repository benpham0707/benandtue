"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";

const ACCENT = "#22C55E";

function StatusPill() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#4ADE80]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shadow-[0_0_12px_#22C55E]" />
      Passion project · on hiatus
    </span>
  );
}

function StatCard({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div
        className="text-3xl md:text-4xl font-medium tracking-tight text-white"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">
        {label}
      </div>
      {sub ? (
        <div className="mt-3 text-xs text-white/40 leading-relaxed">{sub}</div>
      ) : null}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/50">
      <span className="h-1 w-6 bg-[#22C55E]" />
      {children}
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-6 md:p-10">
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            tier: "Level 1",
            title: "Global models",
            sub: "Four base learners trained on the full CS2 corpus",
            items: ["LightGBM", "XGBoost", "CatBoost", "Neural Net (PyTorch)"],
          },
          {
            tier: "Level 2",
            title: "Role-specific",
            sub: "Per-archetype heads with weighted role features",
            items: ["AWPer", "Entry Fragger", "Support", "IGL", "Lurker"],
          },
          {
            tier: "Level 3",
            title: "Personalized",
            sub: "Player-level fine-tunes with online updates",
            items: [
              "Personalized LightGBM",
              "Online updater",
              "Bayesian per-player",
              "Meta-personal",
            ],
          },
        ].map((col) => (
          <div
            key={col.tier}
            className="rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/[0.04] p-5"
          >
            <div className="text-[11px] uppercase tracking-[0.28em] text-[#4ADE80]">
              {col.tier}
            </div>
            <div
              className="mt-2 text-2xl text-white"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {col.title}
            </div>
            <p className="mt-2 text-xs text-white/50 leading-relaxed">{col.sub}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-white/80">
              {col.items.map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#22C55E]" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="text-[11px] uppercase tracking-[0.28em] text-white/50">
          Stitched by
        </div>
        <div
          className="mt-1 text-xl text-white"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          MetaEnsemble + Attention Gate
        </div>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">
          Learns per-sample mixing weights across the three levels, with
          stacking and diversity-based weighting on top. Output is a single
          calibrated OVER/UNDER probability for the player's kills line.
        </p>
      </div>
    </div>
  );
}

function ConfidenceSignalsChart() {
  const signals: { name: string; weight: number }[] = [
    { name: "Model agreement", weight: 0.2 },
    { name: "Prediction margin", weight: 0.15 },
    { name: "Historical accuracy", weight: 0.15 },
    { name: "Feature consistency", weight: 0.1 },
    { name: "Prediction stability", weight: 0.1 },
    { name: "Data density", weight: 0.1 },
    { name: "Ensemble entropy", weight: 0.1 },
    { name: "Calibration quality", weight: 0.1 },
  ];
  const max = 0.2;
  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-6 md:p-8">
      <div className="mb-5 flex items-baseline justify-between">
        <div
          className="text-2xl text-white"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Confidence score, weighted
        </div>
        <div className="text-xs text-white/40">8 signals → High / Med / Low</div>
      </div>
      <div className="space-y-3">
        {signals.map((s) => (
          <div key={s.name}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="text-white/70">{s.name}</span>
              <span className="text-[#4ADE80] tabular-nums">
                {Math.round(s.weight * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E]"
                style={{ width: `${(s.weight / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/10 py-2">
          <div className="text-[#4ADE80]">High</div>
          <div className="text-white/50">≥ 0.80</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] py-2">
          <div className="text-white/80">Medium</div>
          <div className="text-white/50">≥ 0.60</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] py-2">
          <div className="text-white/60">Low</div>
          <div className="text-white/40">≥ 0.40</div>
        </div>
      </div>
    </div>
  );
}

function DecisionTree() {
  const rows: { cond: string; out: string; tone: "good" | "ok" | "skip" }[] = [
    {
      cond: "kelly ≤ 0",
      out: "NO BET — Insufficient edge",
      tone: "skip",
    },
    {
      cond: "confidence = high · edge > 10%",
      out: "STRONG BET — High confidence + significant edge",
      tone: "good",
    },
    {
      cond: "confidence = high · edge > 5%",
      out: "BET — High confidence + good edge",
      tone: "good",
    },
    {
      cond: "confidence = medium · edge > 8%",
      out: "BET — Moderate confidence + strong edge",
      tone: "ok",
    },
    {
      cond: "confidence = medium · edge > 5%",
      out: "SMALL BET — Moderate confidence + decent edge",
      tone: "ok",
    },
    {
      cond: "otherwise",
      out: "PASS — Consider but proceed with caution",
      tone: "skip",
    },
  ];
  const toneStyle: Record<typeof rows[0]["tone"], string> = {
    good: "border-[#22C55E]/40 bg-[#22C55E]/10 text-[#86EFAC]",
    ok: "border-amber-400/30 bg-amber-400/5 text-amber-200",
    skip: "border-white/10 bg-white/[0.02] text-white/50",
  };
  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-6 md:p-8">
      <div
        className="mb-5 text-2xl text-white"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        Bet recommendation, by case
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.cond}
            className={`grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-xl border px-4 py-3 text-sm md:grid-cols-[260px_minmax(0,1fr)] ${toneStyle[r.tone]}`}
          >
            <code className="font-mono text-xs text-white/70 md:text-sm">
              {r.cond}
            </code>
            <span className="font-medium">{r.out}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-white/40">
        Direction (OVER / UNDER) is taken from <code className="text-white/60">probability &gt; 0.5</code>.
        Kelly size is then clipped to a max 10% single-bet, 30% total-portfolio exposure.
      </div>
    </div>
  );
}

export default function ForesightPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04060A] text-white">
      <Navigation />

      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute -top-40 -left-40 h-[640px] w-[640px] rounded-full bg-gradient-to-br from-[#052E16] via-[#0B4F2A] to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[640px] w-[640px] rounded-full bg-gradient-to-br from-[#22C55E]/20 via-[#0B4F2A]/40 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#0B4F2A] to-transparent blur-3xl opacity-60" />
      </div>

      {/* Hero */}
      <section className="px-6 pt-32 pb-20 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/portfolio"
            className="mb-10 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
          >
            <span aria-hidden>←</span> Back to portfolio
          </Link>

          <StatusPill />

          <div className="mt-6 grid items-stretch gap-8 lg:grid-cols-[minmax(0,auto)_minmax(0,1fr)]">
            <h1
              className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.02]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Foresight
              <span className="block text-white/40 italic font-light">
                a calibrated ML book for Counter-Strike props.
              </span>
            </h1>

            <div className="flex justify-start lg:items-stretch lg:justify-end">
              <a
                href="/foresight/dashboard-comparison.png"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Foresight Prediction Dashboard screenshot in a new tab"
                className="block w-full lg:h-full lg:w-auto"
              >
                <div className="h-full rounded-2xl border border-[#22C55E]/30 bg-black/60 p-2 shadow-[0_0_120px_-30px_#22C55E]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/foresight/dashboard-comparison.png"
                    alt="Foresight Prediction Dashboard — side-by-side player comparison (b1t vs sh1ro)"
                    className="w-full rounded-xl lg:h-full lg:w-auto lg:max-h-full"
                    draggable={false}
                  />
                </div>
              </a>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-base md:text-lg text-white/70 leading-relaxed">
            A production-grade pipeline that ingests CS2 match data and
            PrizePicks lines, runs a three-tier ensemble (Global → Role →
            Personalized) with Bayesian calibration, and converts honest
            probabilities into Kelly-sized OVER/UNDER recommendations.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {[
              "Python · PyTorch · LightGBM",
              "FastAPI · Postgres / Supabase",
              "PandaScore · PrizePicks",
              "Bayesian calibration",
              "Correlation-aware Kelly",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/15 px-3 py-1.5 text-white/70"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Hiatus note */}
      <section className="px-6 pb-16 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
          <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 text-[#4ADE80]"
              aria-hidden
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8v4l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              <span className="text-white">Foresight is on a deliberate pause.</span>{" "}
              It started as a personal passion project — quant on a niche we
              cared about — and the engineering still excites us. We stepped
              back because larger client work and the rest of the studio
              pulled focus. The model trains, the pipeline runs, the artifacts
              ship; we're proud of the bones. When the right window opens, we'd
              love to take it the rest of the way.
            </p>
          </div>
        </div>
      </section>

      {/* The numbers */}
      <section className="px-6 pb-24 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <SectionLabel>By the numbers</SectionLabel>
        <h2
          className="text-3xl md:text-5xl font-medium tracking-tight mb-10"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          What got built, in real units.
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            value="0.92"
            label="Test AUC"
            sub="CatBoost 0.9236 · XGBoost 0.9196 · LightGBM 0.9148 on held-out CS2 props."
          />
          <StatCard
            value="123,322"
            label="Player-performance rows"
            sub="Across 17,914 matches and 18,050 maps, scraped from PandaScore."
          />
          <StatCard
            value="100+"
            label="Engineered features"
            sub="Rolling, contextual, temporal, mutual-opponent windows of 5/10/20/30 matches."
          />
          <StatCard
            value="5"
            label="Role-specialized heads"
            sub="AWPer, Entry, Support, IGL, Lurker — each with its own weighted feature set."
          />
          <StatCard
            value="9,788"
            label="Training rows"
            sub="2,796 validation · 1,398 held-out test. ~54/46 UNDER/OVER class balance."
          />
          <StatCard
            value="4"
            label="Base learners"
            sub="LightGBM, XGBoost, CatBoost, and a PyTorch MLP ensemble, stacked under an attention gate."
          />
          <StatCard
            value="8"
            label="Confidence signals"
            sub="Margin, model agreement, stability, density, entropy, calibration… combined to a single tier."
          />
          <StatCard
            value="181"
            label="Commits over 4 months"
            sub="Jun 2025 → Sep 2025. ~57k lines of Python across pipeline, models and infra."
          />
        </div>
      </section>

      {/* Architecture */}
      <section className="px-6 pb-24 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <SectionLabel>Architecture</SectionLabel>
        <h2
          className="text-3xl md:text-5xl font-medium tracking-tight mb-3"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          A three-tier ensemble, stitched by attention.
        </h2>
        <p className="mb-10 max-w-2xl text-base text-white/60 leading-relaxed">
          Most public esports models stop at a single global classifier. Foresight
          layers role-aware heads on top of the global stack, then a per-player
          fine-tune, and learns how to mix them sample-by-sample.
        </p>
        <ArchitectureDiagram />
      </section>

      {/* Calibration + decision tree */}
      <section className="px-6 pb-24 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <SectionLabel>Calibration → recommendation</SectionLabel>
        <h2
          className="text-3xl md:text-5xl font-medium tracking-tight mb-3"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Honest probabilities, then sized bets.
        </h2>
        <p className="mb-10 max-w-2xl text-base text-white/60 leading-relaxed">
          Raw gradient-boosted probabilities are notoriously over-confident.
          Foresight combines five calibration methods — isotonic, Platt,
          binned, Bayesian NN, variational — then folds them into an
          eight-signal confidence score before any Kelly math runs.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <ConfidenceSignalsChart />
          <DecisionTree />
        </div>
      </section>

      {/* Engineering deep-dives */}
      <section className="px-6 pb-24 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <SectionLabel>Engineering deep-dives</SectionLabel>
        <h2
          className="text-3xl md:text-5xl font-medium tracking-tight mb-10"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Four pieces of the system worth opening up.
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "PandaScore client",
              meta: "1,567 LOC · pandascore/client.py",
              body: "Three-tier cache (memory → Redis → disk) with predictive prefetch, an adaptive circuit breaker keyed off a rolling error rate, a request coalescer that deduplicates concurrent identical fetches, tenacity-backed retries with exponential backoff, and Prometheus metrics across seven counters. Optional WebSocket channel for live updates.",
            },
            {
              title: "Bayesian calibration",
              meta: "calibration/bayesian_calibrator.py",
              body: "Five calibration methods combined: isotonic, Platt, binned, Bayesian neural net, and variational inference. Produces both a calibrated probability and an explicit uncertainty band, split into epistemic and aleatoric components — both then feed Kelly sizing as risk inputs.",
            },
            {
              title: "Correlation-aware Kelly",
              meta: "optimization/kelly_criterion.py",
              body: "Quarter-Kelly default, 2% minimum edge, 10% per-bet cap, 30% total exposure cap. Multi-bet portfolios build a pairwise correlation matrix across pending opportunities and project to the nearest positive-semidefinite matrix before solving, so correlated player props don't double-count exposure.",
            },
            {
              title: "Role-specific feature weighting",
              meta: "models/role_models.py",
              body: "Each archetype declares its own key features and weights. AWPers up-weight awp_kills_per_round (1.5×), opening_pick_rate (1.3×), defensive_awp_rating (1.2×). IGLs and Supports up-weight utility damage and trade efficiency. An AdaptiveRoleModel routes each player to the right head at inference time.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-[#22C55E]/30 hover:bg-[#22C55E]/[0.03]"
            >
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#4ADE80]">
                {c.meta}
              </div>
              <h3
                className="mt-2 text-2xl text-white"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {c.title}
              </h3>
              <p className="mt-3 text-sm text-white/65 leading-relaxed">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="px-6 pb-24 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <SectionLabel>Data pipeline</SectionLabel>
        <h2
          className="text-3xl md:text-5xl font-medium tracking-tight mb-10"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Two sources, one warehouse, one inference path.
        </h2>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 md:p-8">
          <pre className="overflow-x-auto text-[11px] md:text-xs leading-relaxed text-white/70">
{`  PandaScore REST + WS                PrizePicks projections
        │                                     │
        ▼                                     ▼
  pandascore/client.py                 collect_prizepicks_cs2.py
  3-tier cache · circuit breaker       backoff · spoofed headers
        │                                     │
        └──────────────┬──────────────────────┘
                       ▼
              Postgres (Supabase)
              10 tables · integer PKs
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
  train_enhanced_v3.py        pipeline/predictor.py
  hierarchical ensemble       online inference
  → .pkl artifacts            → calibrated probs + Kelly size
                                     │
                                     ▼
                          FastAPI (planned) → Dashboard`}
          </pre>
        </div>
      </section>

      {/* Tech stack */}
      <section className="px-6 pb-24 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <SectionLabel>Tech stack</SectionLabel>
        <h2
          className="text-3xl md:text-5xl font-medium tracking-tight mb-10"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          The whole list.
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              h: "ML",
              items: [
                "LightGBM · XGBoost · CatBoost",
                "PyTorch (NN ensemble + attention gate)",
                "Pyro (variational calibration)",
                "Optuna (hyperopt) · FLAML (AutoML)",
                "SHAP (explainability)",
              ],
            },
            {
              h: "Backend",
              items: [
                "Python 3.11",
                "FastAPI 0.109 · Uvicorn · Pydantic v2",
                "SQLAlchemy 2 · Alembic · psycopg2",
                "Celery + beat + Flower",
                "Ray (distributed training)",
              ],
            },
            {
              h: "Infra",
              items: [
                "Supabase Postgres (prod)",
                "TimescaleDB 2.13 (local)",
                "Redis 7 · MLflow · Prometheus",
                "Docker Compose · Nginx",
                "structlog · OpenTelemetry",
              ],
            },
          ].map((col) => (
            <div
              key={col.h}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#4ADE80]">
                {col.h}
              </div>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {col.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#22C55E]"
                      aria-hidden
                    />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Honest retrospective */}
      <section className="px-6 pb-32 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <SectionLabel>Retrospective</SectionLabel>
        <h2
          className="text-3xl md:text-5xl font-medium tracking-tight mb-10"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          What we'd do differently next time.
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              h: "Ship the thin slice first",
              body: "A single FastAPI route — player_id + line in, calibrated probability out, backed by one LightGBM and isotonic calibration — would have closed the loop in a week. Foresight built the cathedral first and the door last.",
            },
            {
              h: "One schema, not two",
              body: "UUID PKs in the ORM and integer PKs in production was the largest single source of friction. Next time: pin to the integer PandaScore IDs from day one and treat that as the contract.",
            },
            {
              h: "Treat dependencies as a feature",
              body: "A pip-tools-locked requirements file and a CI import-smoke-test would have erased a month of August fighting Python imports inside Docker. Boring infrastructure pays for itself faster than any model improvement.",
            },
          ].map((c) => (
            <div
              key={c.h}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <h3
                className="text-xl text-white"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {c.h}
              </h3>
              <p className="mt-3 text-sm text-white/65 leading-relaxed">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div
          className="rounded-3xl border border-[#22C55E]/30 bg-gradient-to-br from-[#0B4F2A]/40 via-black to-black p-10 md:p-14"
          style={{
            boxShadow: `0 0 120px -40px ${ACCENT}`,
          }}
        >
          <h3
            className="text-3xl md:text-5xl font-medium tracking-tight max-w-2xl"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Got a hard data problem looking for the same treatment?
            <span className="block text-white/50 italic font-light">
              we'd love to talk about it.
            </span>
          </h3>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Talk to us
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/40"
            >
              Other work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
