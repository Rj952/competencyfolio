'use client';

import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Legend
} from 'recharts';
import { WEF_SKILLS, AI_TAXONOMY, CARE_PROMPTS, BADGE_LEVELS } from '@/lib/constants';
import { calcEvidenceStrength, calcAcreScore, strengthLabel, calcPortfolioStrength, getBadgeLevel } from '@/lib/utils';

export default function PortfolioPreview({ data, ownerName }) {
  if (!data) return <div style={{ padding: 40, textAlign: 'center', color: '#78716c' }}>Portfolio not available.</div>;

  const T = {
    bg: '#f8f7f4', surface: '#ffffff', surfaceAlt: '#f2f0eb',
    ink: '#1c1917', inkMuted: '#78716c', inkLight: '#a8a29e',
    accent: '#b45309', teal: '#0d9488', indigo: '#4f46e5', rose: '#be123c',
    emerald: '#059669', violet: '#7c3aed', border: '#e7e5e4',
  };

  const s = {
    card: { background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`, padding: 24, marginBottom: 20, boxShadow: '0 1px 2px rgba(28,25,23,0.04)' },
    heading: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, letterSpacing: '-0.02em' },
    tag: (color) => ({ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${color}15`, color, border: `1px solid ${color}25` }),
  };

  const p = data.profile || {};
  const score = calcPortfolioStrength(data);
  const strengthColor = score >= 80 ? T.emerald : score >= 50 ? T.accent : score >= 25 ? '#d97706' : T.rose;

  const radarData = WEF_SKILLS.map(d => {
    const domain = data.skills?.find(sk => sk.domain === d.key);
    const items = domain?.items?.filter(i => i.name) || [];
    const avg = items.length > 0 ? items.reduce((a, i) => a + i.current, 0) / items.length : 0;
    return { name: d.label.split(' ')[0], current: +avg.toFixed(1) };
  });

  const aiRadarData = (data.aiSkills || []).map(sk => ({
    name: sk.label?.split(' ')[0] || '', current: sk.current,
  }));

  const domainEvidence = {};
  (data.competencies || []).forEach(c => { const d = c.domain || 'general'; domainEvidence[d] = (domainEvidence[d] || 0) + 1; });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px 60px', fontFamily: "'DM Sans', sans-serif", color: T.ink }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1c1917 0%, #44403c 100%)', color: '#fff', padding: 36, borderRadius: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {p.photo && <img src={p.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.2)' }} />}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, margin: 0, fontWeight: 800 }}>{p.name || ownerName}</h1>
            {p.title && <p style={{ fontSize: 15, margin: '4px 0 0', opacity: 0.85 }}>{p.title}</p>}
            {p.location && <p style={{ fontSize: 12, margin: '4px 0 0', opacity: 0.6 }}>{p.location}</p>}
          </div>
          <div style={{ textAlign: 'center' }}>
            <svg width={90} height={90} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="45" cy="45" r="37" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
              <circle cx="45" cy="45" r="37" fill="none" stroke={strengthColor} strokeWidth="7"
                strokeDasharray={2 * Math.PI * 37} strokeDashoffset={2 * Math.PI * 37 - (score / 100) * 2 * Math.PI * 37}
                strokeLinecap="round" />
              <text x="45" y="46" textAnchor="middle" dominantBaseline="middle"
                style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fontSize: 22, fontWeight: 800, fill: strengthColor, fontFamily: "'Fraunces', serif" }}>{score}</text>
            </svg>
            <div style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.6, marginTop: -4 }}>Strength</div>
          </div>
        </div>
        {p.summary && <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 16, opacity: 0.9 }}>{p.summary}</p>}
      </div>

      {/* Radar Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={s.card}>
          <h3 style={{ ...s.heading, fontSize: 14, marginBottom: 8 }}>WEF 2030 Skills</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={T.border} /><PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: T.inkMuted }} />
              <PolarRadiusAxis domain={[0, 6]} tick={false} />
              <Radar dataKey="current" stroke={T.accent} fill={T.accent} fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div style={s.card}>
          <h3 style={{ ...s.heading, fontSize: 14, marginBottom: 8 }}>AI Readiness</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={aiRadarData}>
              <PolarGrid stroke={T.border} /><PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: T.inkMuted }} />
              <PolarRadiusAxis domain={[0, 6]} tick={false} />
              <Radar dataKey="current" stroke={T.teal} fill={T.teal} fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badges */}
      {Object.keys(domainEvidence).length > 0 && (
        <div style={s.card}>
          <h3 style={{ ...s.heading, fontSize: 15, marginBottom: 16 }}>★ Digital Badges Earned</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
            {WEF_SKILLS.filter(d => domainEvidence[d.key]).map(domain => {
              const badge = getBadgeLevel(domainEvidence[domain.key]);
              return (
                <div key={domain.key} style={{ textAlign: 'center', padding: 12, background: `${badge.color}08`, borderRadius: 12, border: `1px solid ${badge.color}20` }}>
                  <svg width={52} height={52} viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill={`${badge.color}25`} stroke={badge.color} strokeWidth="2" />
                    <text x="50" y="42" textAnchor="middle" fontSize="20" fill={badge.color}>{badge.icon}</text>
                    <text x="50" y="62" textAnchor="middle" fontSize="9" fontWeight="700" fill={badge.color}>{badge.name.toUpperCase()}</text>
                  </svg>
                  <div style={{ fontSize: 10, fontWeight: 600, marginTop: 4 }}>{domain.label.split('&')[0].trim()}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Credentials */}
      {(data.certifications || []).filter(c => c.name).length > 0 && (
        <div style={s.card}>
          <h3 style={{ ...s.heading, fontSize: 15, marginBottom: 16 }}>◈ Credentials</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {data.certifications.filter(c => c.name).map(cert => (
              <div key={cert.id} style={{ padding: 14, background: `${T.indigo}08`, borderRadius: 10, borderLeft: `3px solid ${T.indigo}` }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{cert.name}</div>
                <div style={{ fontSize: 11, color: T.inkMuted }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence */}
      {(data.competencies || []).filter(c => c.title).length > 0 && (
        <div style={s.card}>
          <h3 style={{ ...s.heading, fontSize: 15, marginBottom: 16 }}>◇ Evidence Portfolio</h3>
          {data.competencies.filter(c => c.title).map(comp => {
            const str = calcEvidenceStrength(comp);
            const acreAvg = calcAcreScore(comp);
            const strColors = [T.inkLight, T.rose, '#d97706', T.teal, T.accent, T.emerald];
            return (
              <div key={comp.id} style={{ padding: 16, marginBottom: 12, background: T.surfaceAlt, borderRadius: 10, borderLeft: `3px solid ${strColors[str]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{comp.title}</h4>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={s.tag(strColors[str])}>Strength: {str}/5</span>
                    {acreAvg && <span style={s.tag(T.violet)}>ACRE: {acreAvg}</span>}
                  </div>
                </div>
                {comp.description && <p style={{ fontSize: 12, color: T.inkMuted, margin: '4px 0', lineHeight: 1.6 }}>{comp.description}</p>}
                {comp.impact && <p style={{ fontSize: 11, color: T.emerald, margin: '4px 0' }}>Impact: {comp.impact}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* CARE Reflections */}
      {(data.reflections || []).filter(r => r.title).length > 0 && (
        <div style={s.card}>
          <h3 style={{ ...s.heading, fontSize: 15, marginBottom: 16 }}>◌ CARE Reflections</h3>
          {data.reflections.filter(r => r.title).map(ref => (
            <div key={ref.id} style={{ padding: 16, marginBottom: 12, background: T.surfaceAlt, borderRadius: 10 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px' }}>{ref.title} {ref.date && <span style={{ fontSize: 11, fontWeight: 400, color: T.inkLight }}>· {ref.date}</span>}</h4>
              {CARE_PROMPTS.map(cp => {
                const val = ref[cp.phase.toLowerCase()];
                if (!val) return null;
                return (
                  <div key={cp.phase} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: cp.color, marginBottom: 2 }}>{cp.icon} {cp.phase}</div>
                    <p style={{ fontSize: 12, color: T.inkMuted, margin: 0, lineHeight: 1.6 }}>{val}</p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Endorsements */}
      {(data.endorsements || []).filter(e => e.name).length > 0 && (
        <div style={s.card}>
          <h3 style={{ ...s.heading, fontSize: 15, marginBottom: 16 }}>♦ Endorsements</h3>
          {data.endorsements.filter(e => e.name).map(end => (
            <div key={end.id} style={{ padding: 14, marginBottom: 10, background: `${T.emerald}08`, borderRadius: 10, borderLeft: `3px solid ${T.emerald}` }}>
              {end.statement && <p style={{ fontSize: 13, fontStyle: 'italic', color: T.ink, margin: '0 0 8px', lineHeight: 1.6 }}>"{end.statement}"</p>}
              <div style={{ fontSize: 12, fontWeight: 600 }}>{end.name} <span style={{ fontWeight: 400, color: T.inkMuted }}>· {end.relationship}</span></div>
            </div>
          ))}
        </div>
      )}

      {/* 5-Year Plan */}
      {data.plan?.vision && (
        <div style={s.card}>
          <h3 style={{ ...s.heading, fontSize: 15, marginBottom: 12 }}>▹ 5-Year Growth Plan</h3>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: T.inkMuted, marginBottom: 16 }}>{data.plan.vision}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {(data.plan.years || []).filter(y => y.goals).map((y, i) => {
              const colors = [T.accent, T.teal, T.indigo, T.violet, T.emerald];
              const statColors = { planned: T.inkLight, 'in-progress': '#d97706', complete: T.emerald };
              return (
                <div key={y.year} style={{ flex: '1 1 160px', padding: 14, background: `${colors[i]}08`, borderRadius: 10, borderTop: `3px solid ${colors[i]}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: colors[i] }}>Year {y.year}</span>
                    <span style={s.tag(statColors[y.status] || T.inkLight)}>{y.status}</span>
                  </div>
                  <p style={{ fontSize: 11, color: T.inkMuted, margin: 0, lineHeight: 1.5 }}>{y.goals}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px 0 0', borderTop: `1px solid ${T.border}`, marginTop: 20 }}>
        <p style={{ fontSize: 10, color: T.inkLight }}>
          COMPETENCYFOLIO v3 · Created by Dr. Rohan Jowallah · WEF 2030 · CARE · ACRE · CRAFT Frameworks
        </p>
        <p style={{ fontSize: 10, color: T.inkLight, marginTop: 4 }}>
          <a href="/" style={{ color: T.accent, textDecoration: 'none' }}>Build your own portfolio →</a>
        </p>
      </div>
    </div>
  );
}
