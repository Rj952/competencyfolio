import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function calcEvidenceStrength(item) {
  let s = 0;
  if (item.title?.length > 0) s++;
  if (item.description?.length > 50) s++;
  if (item.context?.length > 20) s++;
  if (item.impact?.length > 20) s++;
  if (item.file || item.reflection?.length > 30) s++;
  return s;
}

export function calcAcreScore(item) {
  let total = 0, count = 0;
  ['accuracy', 'completeness', 'relevance', 'equity'].forEach(key => {
    if (item[`acre_${key}`]) { total += item[`acre_${key}`]; count++; }
  });
  return count > 0 ? (total / count).toFixed(1) : null;
}

export function strengthLabel(s) {
  return ["", "Weak", "Basic", "Moderate", "Strong", "Exemplary"][s] || "";
}

export function calcPortfolioStrength(data) {
  if (!data) return 0;
  let score = 0;
  const p = data.profile || {};
  if (p.name) score += 3;
  if (p.title) score += 3;
  if (p.summary?.length > 30) score += 4;
  if (p.email) score += 2;
  if (p.photo) score += 3;

  const filledSkills = (data.skills || []).reduce(
    (a, d) => a + (d.items || []).filter(i => i.name).length, 0
  );
  score += Math.min(filledSkills * 2, 20);

  const aiReady = (data.aiSkills || []).filter(s => s.current >= 4).length;
  score += Math.min(aiReady * 2, 15);
  score += Math.min((data.certifications || []).length * 3, 15);

  const comps = data.competencies || [];
  const avgStr = comps.length > 0
    ? comps.reduce((a, c) => a + calcEvidenceStrength(c), 0) / comps.length : 0;
  score += Math.min(Math.round(avgStr * 4), 20);

  const plan = data.plan || {};
  if (plan.vision) score += 5;
  const filledYears = (plan.years || []).filter(y => y.goals).length;
  score += Math.min(filledYears * 2, 10);
  score += Math.min((data.endorsements || []).length * 2, 10);

  return Math.min(score, 100);
}

export function getBadgeLevel(evidenceCount) {
  const BADGE_LEVELS = [
    { level: 1, name: "Explorer", minEvidence: 1, color: "#a8a29e", icon: "◇" },
    { level: 2, name: "Practitioner", minEvidence: 3, color: "#60a5fa", icon: "◆" },
    { level: 3, name: "Specialist", minEvidence: 5, color: "#a78bfa", icon: "★" },
    { level: 4, name: "Expert", minEvidence: 8, color: "#f59e0b", icon: "✦" },
    { level: 5, name: "Master", minEvidence: 12, color: "#10b981", icon: "✧" },
  ];
  let current = BADGE_LEVELS[0];
  for (const b of BADGE_LEVELS) {
    if (evidenceCount >= b.minEvidence) current = b;
  }
  return current;
}
