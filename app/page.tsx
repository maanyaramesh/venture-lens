"use client";

import { useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  CircleHelp,
  Menu,
  X,
  LoaderCircle,
  AlertTriangle,
  Flame,
} from "lucide-react";
import type { Analysis } from "@/lib/types";

const sections = [
  "Overview",
  "Market",
  "Competition",
  "Product",
  "Business",
  "Risks",
  "Boardroom",
  "Experiments",
];

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] uppercase tracking-[.16em] text-[#77736a]">
        <span>{label}</span>
        <b className="text-[#171713]">{value}</b>
      </div>

      <div className="bar mt-2">
        <i style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function Home() {
  const [idea, setIdea] = useState("");
  const [data, setData] = useState<Analysis | null>(null);
  const [active, setActive] = useState("Overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState(false);

  const [stressTest, setStressTest] = useState<any>(null);
  const [stressLoading, setStressLoading] = useState(false);
  const [stressError, setStressError] = useState("");

  async function analyze() {
    if (!idea.trim()) return;

    setLoading(true);
    setError("");
    setStressTest(null);
    setStressError("");

    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const j = await r.json();

      if (!r.ok) {
        throw new Error(j.message || "Analysis failed");
      }

      setData(j);
      setActive("Overview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  async function runStressTest() {
    if (!idea.trim() || !data) return;

    setStressLoading(true);
    setStressError("");
    setStressTest(null);

    try {
      const r = await fetch("/api/stress-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea,
          analysis: data,
        }),
      });

      const j = await r.json();

      if (!r.ok) {
        throw new Error(j.error || "Stress test failed");
      }

      setStressTest(j);
    } catch (e) {
      setStressError(
        e instanceof Error ? e.message : "Stress test failed"
      );
    } finally {
      setStressLoading(false);
    }
  }

  if (!data)
    return (
      <main className="grain min-h-screen flex flex-col">
        <header className="px-6 md:px-10 py-7 flex justify-between">
          <div className="font-black tracking-[-.05em] text-xl">
            Venture<span className="text-[#879c70]">Lens</span>
          </div>

          <div className="text-[10px] tracking-[.2em] uppercase text-[#77736a]">
            Venture intelligence / 01
          </div>
        </header>

        <section className="flex-1 flex items-center justify-center px-5 py-16">
          <div className="w-full max-w-5xl">
            <div className="grid md:grid-cols-[1.2fr_.8fr] gap-16 items-end">
              <div>
                <div className="flex gap-2 items-center text-[10px] tracking-[.2em] uppercase text-[#77736a] mb-7">
                  <span className="w-2 h-2 rounded-full bg-[#879c70]" />
                  Venture stress test
                </div>

                <h1 className="text-[clamp(52px,8vw,108px)] leading-[.84] font-black tracking-[-.075em]">
                  Know what
                  <br />
                  <em className="font-serif font-normal">
                    to validate.
                  </em>
                </h1>

                <p className="mt-8 max-w-lg text-lg leading-7 text-[#625f57]">
                  Give VentureLens a startup idea. A local AI analyst will
                  break down the actual idea, score its dimensions, identify
                  risks and propose experiments.
                </p>
              </div>

              <div className="border border-[#d8d2c5] bg-[#f8f6f0] p-5">
                <label className="block text-[10px] tracking-[.18em] uppercase text-[#77736a] mb-3">
                  Your startup idea
                </label>

                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                      analyze();
                  }}
                  placeholder="e.g. AI tutor for Indian school students..."
                  className="w-full min-h-40 resize-none bg-transparent outline-none text-xl leading-7 placeholder:text-[#aaa59a]"
                />

                {error && (
                  <div className="mb-4 p-3 bg-[#f2ded9] text-[#74382f] text-xs flex gap-2">
                    <AlertTriangle size={15} />
                    {error}
                  </div>
                )}

                <div className="pt-4 border-t border-[#d8d2c5] flex items-center justify-between gap-4">
                  <span className="text-xs text-[#77736a]">
                    ₹0 local AI · ⌘↵ to analyze
                  </span>

                  <button
                    disabled={loading || !idea.trim()}
                    onClick={analyze}
                    className="bg-[#171713] disabled:opacity-40 text-[#f4f1e8] px-5 py-3 flex items-center gap-3 text-sm font-bold"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle size={16} className="animate-spin" />
                        Analyzing
                      </>
                    ) : (
                      <>
                        Analyze venture
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-20 border-t border-[#d8d2c5] pt-5 flex flex-wrap gap-8 text-xs text-[#77736a]">
              <span>MARKET</span>
              <span>COMPETITION</span>
              <span>PRODUCT</span>
              <span>BUSINESS</span>
              <span>RISK</span>
              <span>ACTION</span>
            </div>
          </div>
        </section>
      </main>
    );

  return (
    <div className="min-h-screen flex bg-[#f4f1e8]">
      <aside
        className={`${
          mobile ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed z-30 inset-y-0 left-0 w-64 bg-[#171713] text-[#f4f1e8] p-6 transition-transform md:relative md:flex md:flex-col`}
      >
        <div className="flex justify-between mb-14">
          <div className="font-black text-xl tracking-[-.05em]">
            Venture<span className="text-[#a7bb91]">Lens</span>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobile(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="text-[9px] tracking-[.22em] text-[#85847b] uppercase mb-3">
          Analysis
        </div>

        <nav>
          {sections.map((s, i) => (
            <button
              key={s}
              onClick={() => {
                setActive(s);
                setMobile(false);
              }}
              className={`w-full text-left px-3 py-2.5 text-sm flex justify-between ${
                active === s
                  ? "bg-[#30302a]"
                  : "text-[#aaa9a1]"
              }`}
            >
              <span>
                <span className="text-[9px] text-[#6e6d66] mr-3">
                  0{i + 1}
                </span>
                {s}
              </span>

              {active === s && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-[#37372f] pt-5">
          <div className="text-[9px] uppercase tracking-[.18em] text-[#77766e]">
            Current venture
          </div>

          <div className="text-sm mt-2 line-clamp-3">
            {data.idea}
          </div>

          <button
            onClick={() => {
              setData(null);
              setIdea("");
              setStressTest(null);
            }}
            className="mt-4 ml-14 text-xs text-[#aaa9a1]"
          >
            + Analyze another
          </button>
        </div>
      </aside>

      {mobile && (
        <div
          onClick={() => setMobile(false)}
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
        />
      )}

      <main className="flex-1 min-w-0">
        <header className="h-20 border-b border-[#d8d2c5] px-5 md:px-10 flex items-center justify-between">
          <button
            className="md:hidden"
            onClick={() => setMobile(true)}
          >
            <Menu />
          </button>

          <div className="hidden md:block text-[10px] tracking-[.2em] uppercase text-[#77736a]">
            Live venture analysis
          </div>

          <CircleHelp size={17} />
        </header>

        <div className="max-w-6xl mx-auto px-5 md:px-10 py-10 fade">
          <div className="flex flex-col lg:flex-row justify-between gap-8 border-b border-[#d8d2c5] pb-10">
            <div>
              <div className="text-[10px] uppercase tracking-[.2em] text-[#77736a] mb-4">
                {data.verdict}
              </div>

              <h2 className="text-5xl md:text-7xl font-black tracking-[-.06em]">
                {data.idea}
              </h2>

              <p className="mt-4 max-w-2xl text-[#625f57] leading-6">
                {data.summary}
              </p>
            </div>

            <div className="flex items-end gap-2">
              <span className="text-[88px] leading-[.7] font-black">
                {data.score}
              </span>

              <span className="text-xs text-[#77736a] pb-1">
                /100
              </span>
            </div>
          </div>

          {active === "Overview" && (
            <Overview
              d={data}
              onStressTest={runStressTest}
              stressLoading={stressLoading}
              stressError={stressError}
              stressTest={stressTest}
            />
          )}

          {active === "Market" && <Market d={data} />}
          {active === "Competition" && <Competition d={data} />}
          {active === "Product" && <Product d={data} />}
          {active === "Business" && <Business d={data} />}
          {active === "Risks" && <Risks d={data} />}
          {active === "Boardroom" && <Boardroom d={data} />}
          {active === "Experiments" && <Experiments d={data} />}
        </div>
      </main>
    </div>
  );
}

function Overview({
  d,
  onStressTest,
  stressLoading,
  stressError,
  stressTest,
}: {
  d: Analysis;
  onStressTest: () => void;
  stressLoading: boolean;
  stressError: string;
  stressTest: any;
}) {
  return (
    <div className="pt-10">
      <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12">
        <div>
          <div className="text-[10px] uppercase tracking-[.2em] text-[#77736a] mb-6">
            Signal breakdown
          </div>

          <div className="space-y-6">
            {Object.entries(d.scores).map(([k, v]) => (
              <Score key={k} label={k} value={v} />
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[.2em] text-[#77736a] mb-6">
            What to validate
          </div>

          <div className="border border-[#d8d2c5] p-7 bg-[#f8f6f0]">
            <div className="text-2xl font-bold">
              Your highest-risk assumptions
            </div>

            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              {d.experiments.slice(0, 3).map((x, i) => (
                <div
                  className="border border-[#d8d2c5] p-4"
                  key={x}
                >
                  <span className="text-[10px] text-[#879c70]">
                    0{i + 1}
                  </span>

                  <div className="mt-5 font-bold text-sm">
                    {x}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 border border-[#cdbcb7] bg-[#f8efec]">
        <div className="p-7 flex flex-col md:flex-row justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 rounded-full bg-[#74382f] text-white flex items-center justify-center">
              <Flame size={18} />
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[.2em] text-[#9a4b40]">
                Hostile investor mode
              </div>

              <h3 className="text-2xl font-black tracking-[-.03em] mt-2">
                Try to kill this idea.
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#625f57] max-w-xl">
                Don't tell me why it works. Find the assumptions that
                could make this specific venture fail — and tell you
                how to test them cheaply.
              </p>
            </div>
          </div>

          <button
            onClick={onStressTest}
            disabled={stressLoading}
            className="shrink-0 self-start md:self-center bg-[#171713] text-[#f4f1e8] px-6 py-3 flex items-center gap-3 text-sm font-bold disabled:opacity-50"
          >
            {stressLoading ? (
              <>
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                />
                Stress-testing
              </>
            ) : (
              <>
                Stress Test
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {stressError && (
          <div className="mx-7 mb-7 p-4 bg-[#f2ded9] text-[#74382f] text-sm flex gap-2">
            <AlertTriangle size={16} />
            {stressError}
          </div>
        )}
      </div>

      {stressTest?.risks?.length > 0 && (
        <div className="mt-6">
          <div className="text-[10px] uppercase tracking-[.2em] text-[#77736a] mb-5">
            Stress test results
          </div>

          <div className="space-y-4">
            {stressTest.risks.map((risk: any, index: number) => (
              <div
                key={index}
                className="border border-[#d8d2c5] bg-[#f8f6f0] p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                  <div className="flex gap-4">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-[#171713] text-[#f4f1e8] flex items-center justify-center text-xs font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div>
                      <h4 className="font-bold text-lg">
                        {risk.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-[#625f57] max-w-2xl">
                        {risk.explanation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[9px] font-bold tracking-[.12em] px-3 py-2 ${
                        risk.severity === "HIGH"
                          ? "bg-[#f2ded9] text-[#74382f]"
                          : risk.severity === "MEDIUM"
                          ? "bg-[#eee7d3] text-[#75633a]"
                          : "bg-[#dfe8d8] text-[#526848]"
                      }`}
                    >
                      {risk.severity}
                    </span>

                    <span className="text-[10px] text-[#77736a]">
                      {risk.confidence}% confidence
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="border border-[#d8d2c5] p-5">
                    <div className="text-[9px] uppercase tracking-[.18em] text-[#77736a]">
                      How to test
                    </div>

                    <p className="mt-3 text-sm leading-6">
                      {risk.test}
                    </p>
                  </div>

                  <div className="border border-[#d8d2c5] p-5">
                    <div className="text-[9px] uppercase tracking-[.18em] text-[#77736a]">
                      Pass condition
                    </div>

                    <p className="mt-3 text-sm leading-6">
                      {risk.passCondition}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Market({ d }: { d: Analysis }) {
  return (
    <div className="pt-10">
      <div className="grid md:grid-cols-4 gap-px bg-[#d8d2c5]">
        {[
          ["TAM", d.market.tam],
          ["SAM", d.market.sam],
          ["INITIAL", d.market.initial],
          ["GROWTH", d.market.growth],
        ].map((x) => (
          <div
            className="bg-[#f4f1e8] p-7"
            key={x[0]}
          >
            <div className="text-[10px] tracking-[.18em] text-[#77736a]">
              {x[0]}
            </div>

            <div className="text-3xl font-black mt-5">
              {x[1]}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10 mt-12">
        <div>
          <h3 className="font-bold text-xl">Target users</h3>

          {d.market.targetUsers.map((x) => (
            <p
              className="border-b border-[#d8d2c5] py-4 text-[#625f57]"
              key={x}
            >
              {x}
            </p>
          ))}
        </div>

        <div>
          <h3 className="font-bold text-xl">Signals</h3>

          {d.market.signals.map((x) => (
            <p
              className="border-b border-[#d8d2c5] py-4 text-[#625f57]"
              key={x}
            >
              {x}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function Competition({ d }: { d: Analysis }) {
  return (
    <div className="pt-10">
      <div className="grid md:grid-cols-2 gap-5">
        {d.competition.map((c, i) => (
          <div
            className="border border-[#d8d2c5] p-6 bg-[#f8f6f0]"
            key={c.name}
          >
            <div className="text-[10px] text-[#879c70]">
              0{i + 1}
            </div>

            <h3 className="text-xl font-bold mt-4">
              {c.name}
            </h3>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[9px] uppercase tracking-[.16em] text-[#77736a]">
                  Strength
                </div>
                <p>{c.strength}</p>
              </div>

              <div>
                <div className="text-[9px] uppercase tracking-[.16em] text-[#77736a]">
                  Weakness
                </div>
                <p className="text-[#77736a]">
                  {c.weakness}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Product({ d }: { d: Analysis }) {
  return (
    <div className="pt-10 grid lg:grid-cols-2 gap-12">
      <div>
        <h3 className="font-bold text-xl">
          MVP — must have
        </h3>

        {d.product.mustHave.map((x) => (
          <p
            className="border-b border-[#d8d2c5] py-4"
            key={x}
          >
            ✓ {x}
          </p>
        ))}

        <h3 className="font-bold text-xl mt-10">
          Later
        </h3>

        {d.product.later.map((x) => (
          <p
            className="border-b border-[#d8d2c5] py-4 text-[#77736a]"
            key={x}
          >
            ○ {x}
          </p>
        ))}
      </div>

      <div>
        <h3 className="font-bold text-xl mb-5">
          Suggested architecture
        </h3>

        <div className="border border-[#d8d2c5] p-6 bg-[#f8f6f0]">
          {d.product.architecture.map((x, i) => (
            <div
              key={x}
              className="py-3 border-b border-[#d8d2c5] last:border-0"
            >
              {i + 1}. {x}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Business({ d }: { d: Analysis }) {
  return (
    <div className="pt-10">
      <div className="grid md:grid-cols-3 gap-5">
        {[
          ["ARPU", d.business.arpu],
          ["CAC", d.business.cac],
          ["BREAK-EVEN", d.business.breakEven],
        ].map((x) => (
          <div
            className="border border-[#d8d2c5] p-7"
            key={x[0]}
          >
            <div className="text-[10px] tracking-[.18em] text-[#77736a]">
              {x[0]}
            </div>

            <div className="text-3xl font-black mt-5">
              {x[1]}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="font-bold text-xl">
          Assumptions
        </h3>

        {d.business.assumptions.map((x) => (
          <p
            className="border-b border-[#d8d2c5] py-4 text-[#625f57]"
            key={x}
          >
            {x}
          </p>
        ))}
      </div>
    </div>
  );
}

function Risks({ d }: { d: Analysis }) {
  return (
    <div className="pt-10 space-y-4">
      {d.risks.map((r, i) => (
        <div
          className="border border-[#d8d2c5] p-6 bg-[#f8f6f0] grid md:grid-cols-[50px_1fr_1fr] gap-5"
          key={r.title}
        >
          <div className="text-[#b85d4f] font-black">
            0{i + 1}
          </div>

          <div>
            <div className="flex gap-3 items-center">
              <h3 className="font-bold">
                {r.title}
              </h3>

              <span className="text-[9px] border border-[#d8d2c5] px-2 py-1">
                {r.severity}
              </span>
            </div>

            <p className="text-sm text-[#625f57] leading-6">
              {r.text}
            </p>
          </div>

          <div>
            <div className="text-[9px] tracking-[.18em] text-[#77736a]">
              TEST IT
            </div>

            <p className="text-sm">
              {r.test}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Boardroom({ d }: { d: Analysis }) {
  return (
    <div className="pt-10 border border-[#2d2d27] bg-[#1d1d19] text-[#f4f1e8]">
      {d.boardroom.map((p) => (
        <div
          className="p-6 border-b border-[#37372f] grid md:grid-cols-[120px_1fr] gap-5"
          key={p.role}
        >
          <div className="text-[#a7bb91] text-xs tracking-[.16em]">
            {p.role}
          </div>

          <p className="m-0 text-lg leading-7">
            {p.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function Experiments({ d }: { d: Analysis }) {
  return (
    <div className="pt-10 grid md:grid-cols-3 gap-5">
      {d.experiments.map((x, i) => (
        <div
          className="border border-[#d8d2c5] p-7 min-h-52 bg-[#f8f6f0]"
          key={x}
        >
          <div className="text-[#879c70] font-black">
            0{i + 1}
          </div>

          <h3 className="text-xl font-bold mt-10">
            {x}
          </h3>

          <p className="text-sm text-[#77736a] mt-3">
            Test this assumption before committing significant
            build time.
          </p>
        </div>
      ))}
    </div>
  );
}