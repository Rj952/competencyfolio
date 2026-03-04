import Link from 'next/link';

export default function HomePage() {
  const features = [
    { icon: "🌊", title: "WEF 2030 Skills Map", desc: "10 core skill clusters aligned with the World Economic Forum's Future of Jobs framework", color: "text-brand-600" },
    { icon: "🤖", title: "AI Readiness Index", desc: "8-competency taxonomy tracking your preparedness for the AI-transformed workplace", color: "text-sea-600" },
    { icon: "🏅", title: "Digital Badges", desc: "Earn visual credentials from Explorer to Master as you build evidence of competence", color: "text-coral-500" },
    { icon: "🌺", title: "CARE + ACRE Reflections", desc: "Guided reflection using Consider-Analyze-Reflect-Evaluate with evidence quality scoring", color: "text-rose-500" },
    { icon: "📊", title: "Evidence Strength Scoring", desc: "Auto-calculated 5-point evidence quality assessment with ACRE evaluation overlay", color: "text-brand-700" },
    { icon: "🤝", title: "Peer Endorsements", desc: "Collect third-party validation from supervisors, colleagues, and collaborators", color: "text-amber-600" },
    { icon: "🗺️", title: "5-Year Growth Plan", desc: "Map your professional trajectory with year-by-year milestones and status tracking", color: "text-emerald-600" },
    { icon: "🔍", title: "Gap Analysis", desc: "Visual radar charts and bar graphs revealing exactly where to focus development", color: "text-indigo-600" },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div>
          <span className="heading-display text-xl text-brand-700 tracking-tight">CompetencyFolio</span>
          <span className="text-[10px] text-stone-400 ml-2 uppercase tracking-widest">v3</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-medium">
            Sign In
          </Link>
          <Link href="/register" className="btn-primary text-sm px-5 py-2 rounded-lg inline-block no-underline">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-16 pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 tracking-wide">
            <span>🌴</span> Built on WEF 2030 Skills Framework
          </div>
          <h1 className="heading-display text-5xl md:text-6xl text-stone-900 leading-[1.1] mb-6">
            Your evidence-based<br />
            <span className="text-brand-600">professional portfolio</span>
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed mb-8 max-w-xl">
            Map skills to global standards. Build verifiable evidence. Earn digital badges.
            CompetencyFolio aligns your professional story with what 85% of employers now demand:
            demonstrated skills, not just credentials.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/register" className="btn-primary text-base px-8 py-3 rounded-xl inline-block no-underline">
              Start Building Your Portfolio →
            </Link>
            <Link href="/share/demo" className="btn-secondary text-base px-6 py-3 rounded-xl inline-block no-underline">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-brand-800 via-brand-700 to-sea-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: "85%", label: "of employers use skills-based hiring" },
            { num: "10", label: "WEF 2030 core skill clusters" },
            { num: "8", label: "AI readiness competencies" },
            { num: "5", label: "digital badge achievement levels" },
          ].map(s => (
            <div key={s.num} className="text-center">
              <div className="heading-display text-3xl text-coral-300 mb-1">{s.num}</div>
              <div className="text-sm text-brand-200">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="heading-display text-3xl text-stone-900 mb-3">
            Everything you need to prove competence
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto">
            Research-driven features that no other portfolio platform offers — designed by
            Dr. Rohan Jowallah, Educator and AI Consultant with 30+ years of experience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(f => (
            <div key={f.title} className="card card-hover p-5 group">
              <div className={`text-2xl mb-3 ${f.color}`}>{f.icon}</div>
              <h3 className="font-bold text-sm text-stone-900 mb-1.5 group-hover:text-brand-700 transition-colors">{f.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Frameworks */}
      <section className="bg-brand-50/50 py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 border-t-4 border-t-brand-500">
              <h3 className="heading-display text-lg text-brand-700 mb-2">🌺 CARE Framework</h3>
              <p className="text-sm text-stone-500 mb-4">Guided professional reflection in four phases</p>
              <div className="space-y-2">
                {["🔍 Consider — Identify the situation", "🧩 Analyze — Apply knowledge & skills",
                  "🪞 Reflect — Learn about yourself", "⚖️ Evaluate — Shape future growth"].map(s => (
                  <div key={s} className="text-xs text-stone-600 py-1 border-b border-stone-100 last:border-0">{s}</div>
                ))}
              </div>
            </div>
            <div className="card p-6 border-t-4 border-t-sea-500">
              <h3 className="heading-display text-lg text-sea-700 mb-2">🌊 ACRE Quality Lens</h3>
              <p className="text-sm text-stone-500 mb-4">Evaluate evidence quality across four dimensions</p>
              <div className="space-y-2">
                {["✓ Accuracy — Factually correct & verifiable", "◉ Completeness — Fully demonstrates competency",
                  "◎ Relevance — Directly related to the skill", "🤝 Equity — Considers diverse perspectives"].map(s => (
                  <div key={s} className="text-xs text-stone-600 py-1 border-b border-stone-100 last:border-0">{s}</div>
                ))}
              </div>
            </div>
            <div className="card p-6 border-t-4 border-t-coral-500">
              <h3 className="heading-display text-lg text-coral-600 mb-2">🌅 CRAFT Prompt Design</h3>
              <p className="text-sm text-stone-500 mb-4">Structured approach to AI interaction</p>
              <div className="space-y-2">
                {["🎯 Context — Set the scene", "👤 Role — Define AI's perspective",
                  "⚡ Action — Specify the task", "📋 Format — Shape the output",
                  "📏 Threshold — Set quality standards"].map(s => (
                  <div key={s} className="text-xs text-stone-600 py-1 border-b border-stone-100 last:border-0">{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h2 className="heading-display text-3xl text-stone-900 mb-4">
          Ready to build your evidence-based portfolio?
        </h2>
        <p className="text-stone-500 mb-8 max-w-md mx-auto">
          Join professionals mapping their skills to WEF 2030 standards and demonstrating competence with evidence, not just claims.
        </p>
        <Link href="/register" className="btn-primary text-base px-10 py-3.5 rounded-xl inline-block no-underline">
          Create Your Portfolio →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between text-xs text-stone-400">
          <div>
            <span className="heading-display text-sm text-brand-600">CompetencyFolio v3</span>
            <span className="ml-2">Created by Dr. Rohan Jowallah</span>
          </div>
          <div>
            WEF 2030 · CARE · ACRE · CRAFT Frameworks
          </div>
        </div>
      </footer>
    </div>
  );
}
