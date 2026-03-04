// ─── WEF 2030 CORE SKILLS ─────────────────────────────────────
export const WEF_SKILLS = [
  { key: "cognitive", label: "Analytical & Critical Thinking", color: "#0e7490", icon: "🧠",
    desc: "Break down complex problems, make data-driven decisions, evaluate evidence" },
  { key: "selfMgmt", label: "Resilience & Adaptability", color: "#059669", icon: "🌴",
    desc: "Flexibility, agility, growth mindset, self-motivation under uncertainty" },
  { key: "interpersonal", label: "Leadership & Collaboration", color: "#0f766e", icon: "🤝",
    desc: "Social influence, teamwork, empathy, talent management" },
  { key: "digital", label: "Digital & Tech Literacy", color: "#0891b2", icon: "💻",
    desc: "Data management, AI literacy, cybersecurity awareness, digital fluency" },
  { key: "innovation", label: "Creative Thinking & Innovation", color: "#ea580c", icon: "🌺",
    desc: "Curiosity, creative problem-solving, experimentation, design thinking" },
  { key: "socialImpact", label: "Ethics & Sustainability", color: "#16a34a", icon: "🌍",
    desc: "Environmental stewardship, ethical reasoning, cultural awareness, DEI" },
  { key: "entrepreneurial", label: "Entrepreneurial Thinking", color: "#7c3aed", icon: "🚀",
    desc: "Risk-taking, strategic vision, decision-making, resource management" },
  { key: "communication", label: "Communication & Storytelling", color: "#06b6d4", icon: "📢",
    desc: "Persuasion, negotiation, storytelling, active listening, writing" },
  { key: "global", label: "Global & Cross-Cultural", color: "#f97316", icon: "🌎",
    desc: "Multilingual ability, cross-cultural understanding, global awareness" },
  { key: "learning", label: "Lifelong Learning & Metacognition", color: "#14b8a6", icon: "📚",
    desc: "Reflective thinking, learning agility, curiosity, self-directed growth" },
];

// ─── AI READINESS TAXONOMY ────────────────────────────────────
export const AI_TAXONOMY = [
  { id: "prompting", label: "Prompt Engineering", desc: "Crafting effective prompts for AI systems", icon: "⌨️" },
  { id: "literacy", label: "AI Literacy", desc: "Understanding AI capabilities, limitations & impact", icon: "📖" },
  { id: "tools", label: "AI Tool Proficiency", desc: "Using AI tools for productivity and creation", icon: "🔧" },
  { id: "data", label: "Data & Analytics", desc: "Working with data, interpreting AI outputs", icon: "📊" },
  { id: "ethics", label: "AI Ethics & Governance", desc: "Responsible AI use, bias awareness, policy", icon: "⚖️" },
  { id: "integration", label: "AI Integration", desc: "Embedding AI into workflows and curricula", icon: "🔗" },
  { id: "evaluation", label: "AI Output Evaluation", desc: "Critically assessing AI-generated content", icon: "🔍" },
  { id: "creation", label: "AI-Assisted Creation", desc: "Using AI as co-creator for content, code, media", icon: "✨" },
];

export const PROFICIENCY_LEVELS = [
  { value: 1, label: "Unaware", color: "#d6d3d1" },
  { value: 2, label: "Aware", color: "#67e8f9" },
  { value: 3, label: "Beginner", color: "#22d3ee" },
  { value: 4, label: "Intermediate", color: "#14b8a6" },
  { value: 5, label: "Advanced", color: "#f97316" },
  { value: 6, label: "Expert", color: "#059669" },
];

// ─── CARE FRAMEWORK ───────────────────────────────────────────
export const CARE_PROMPTS = [
  { phase: "Consider", prompt: "What was the situation or challenge you faced?", icon: "🔍", color: "#0e7490" },
  { phase: "Analyze", prompt: "What knowledge, skills, or strategies did you apply?", icon: "🧩", color: "#06b6d4" },
  { phase: "Reflect", prompt: "What did you learn about yourself or your practice?", icon: "🪞", color: "#7c3aed" },
  { phase: "Evaluate", prompt: "How will this shape your future actions or growth?", icon: "⚖️", color: "#059669" },
];

// ─── ACRE FRAMEWORK ──────────────────────────────────────────
export const ACRE_CRITERIA = [
  { key: "accuracy", label: "Accuracy", desc: "Is the evidence factually correct and verifiable?", icon: "✓", color: "#059669" },
  { key: "completeness", label: "Completeness", desc: "Does it fully demonstrate the claimed competency?", icon: "◉", color: "#0e7490" },
  { key: "relevance", label: "Relevance", desc: "Is it directly relevant to the skill or competency?", icon: "◎", color: "#0f766e" },
  { key: "equity", label: "Equity", desc: "Does it consider diverse perspectives and inclusion?", icon: "🤝", color: "#7c3aed" },
];

export const EVIDENCE_TYPES = [
  "Project Report", "Presentation", "Published Work", "Certificate",
  "Performance Review", "Student Feedback", "Peer Endorsement",
  "Media Coverage", "Award", "Code Repository", "Research Paper",
  "Workshop Facilitation", "Training Completion", "Portfolio Artifact",
  "Community Impact", "Other",
];

export const BADGE_LEVELS = [
  { level: 1, name: "Explorer", minEvidence: 1, color: "#a8a29e", icon: "🐚" },
  { level: 2, name: "Practitioner", minEvidence: 3, color: "#22d3ee", icon: "🌊" },
  { level: 3, name: "Specialist", minEvidence: 5, color: "#14b8a6", icon: "🌴" },
  { level: 4, name: "Expert", minEvidence: 8, color: "#f97316", icon: "🌅" },
  { level: 5, name: "Master", minEvidence: 12, color: "#059669", icon: "🏆" },
];

export const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "skills", label: "Skills 2030", icon: "🌊" },
  { id: "ai", label: "AI Readiness", icon: "🤖" },
  { id: "badges", label: "Badges", icon: "🏅" },
  { id: "certs", label: "Credentials", icon: "📜" },
  { id: "evidence", label: "Evidence", icon: "📋" },
  { id: "reflect", label: "CARE+ACRE", icon: "🌺" },
  { id: "plan", label: "5-Year Plan", icon: "🗺️" },
  { id: "endorse", label: "Endorsements", icon: "🤝" },
  { id: "preview", label: "Portfolio", icon: "👁️" },
];

// ─── DEFAULT PORTFOLIO STATE ──────────────────────────────────
export function getDefaultPortfolio() {
  return {
    profile: { name: "", title: "", email: "", location: "", phone: "", linkedin: "", summary: "", photo: null },
    skills: WEF_SKILLS.map(d => ({
      domain: d.key,
      items: [{ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: "", current: 3, target: 5 }],
    })),
    aiSkills: AI_TAXONOMY.map(t => ({ ...t, current: 1, target: 4, evidence: "" })),
    certifications: [],
    competencies: [],
    reflections: [],
    plan: {
      vision: "",
      values: "",
      years: [1, 2, 3, 4, 5].map(y => ({
        year: y, goals: "", milestones: "", targetSkills: "", status: "planned",
      })),
    },
    endorsements: [],
  };
}
