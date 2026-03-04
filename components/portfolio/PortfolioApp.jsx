'use client';

import { useState, useRef, useMemo, useCallback } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Legend, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, BarChart, Bar, Cell
} from 'recharts';
import {
  WEF_SKILLS, AI_TAXONOMY, PROFICIENCY_LEVELS, CARE_PROMPTS,
  ACRE_CRITERIA, EVIDENCE_TYPES, BADGE_LEVELS, TABS
} from '@/lib/constants';
import {
  uid, calcEvidenceStrength, calcAcreScore, strengthLabel,
  calcPortfolioStrength, getBadgeLevel
} from '@/lib/utils';

export default function PortfolioApp({
  data, user, onDataChange, onLogout, onExport, onImport, onShare,
  saveStatus, lastSaved
}) {
  const [tab, setTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const fileRef = useRef(null);
  const importRef = useRef(null);

  const portfolioScore = useMemo(() => calcPortfolioStrength(data), [data]);

  // Deep update helper
  const upd = useCallback((path, val) => {
    const next = JSON.parse(JSON.stringify(data));
    const keys = path.split('.');
    let obj = next;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = val;
    onDataChange(next);
  }, [data, onDataChange]);

  // Theme colors — Caribbean palette
  const T = darkMode ? {
    bg: '#0c0a09', surface: '#1c1917', surfaceAlt: '#292524', surfaceHover: '#44403c',
    ink: '#fafaf9', inkMuted: '#a8a29e', inkLight: '#78716c',
    accent: '#14b8a6', teal: '#2dd4bf', indigo: '#22d3ee', rose: '#fb923c',
    emerald: '#34d399', amber: '#fbbf24', violet: '#a78bfa', sky: '#67e8f9',
    border: '#44403c', borderLight: '#292524',
    shadow: '0 1px 2px rgba(0,0,0,0.3)', shadowMd: '0 4px 16px rgba(0,0,0,0.4)',
    gradientHero: 'linear-gradient(135deg, #0f766e 0%, #0e7490 100%)',
    accentSoft: 'rgba(20,184,166,0.12)', violetSoft: 'rgba(167,139,250,0.1)',
    indigoSoft: 'rgba(34,211,238,0.1)', emeraldSoft: 'rgba(52,211,153,0.1)',
    amberSoft: 'rgba(251,191,36,0.1)',
  } : {
    bg: '#f8f7f4', surface: '#ffffff', surfaceAlt: '#f0fdfa', surfaceHover: '#ccfbf1',
    ink: '#1c1917', inkMuted: '#78716c', inkLight: '#a8a29e',
    accent: '#0f766e', teal: '#0d9488', indigo: '#0e7490', rose: '#ea580c',
    emerald: '#059669', amber: '#f97316', violet: '#7c3aed', sky: '#0891b2',
    border: '#e7e5e4', borderLight: '#f5f5f4',
    shadow: '0 1px 2px rgba(28,25,23,0.04)', shadowMd: '0 4px 16px rgba(28,25,23,0.06)',
    gradientHero: 'linear-gradient(135deg, #115e59 0%, #0e7490 100%)',
    accentSoft: 'rgba(15,118,110,0.07)', violetSoft: 'rgba(124,58,237,0.06)',
    indigoSoft: 'rgba(14,116,144,0.06)', emeraldSoft: 'rgba(5,150,105,0.06)',
    amberSoft: 'rgba(249,115,22,0.06)',
  };

  const strengthColor = (s) => [T.inkLight, T.rose, T.amber, T.teal, T.accent, T.emerald][s] || T.inkLight;

  // Styles
  const s = {
    card: { background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`, padding: 24, marginBottom: 20, boxShadow: T.shadow, transition: 'all 0.2s' },
    heading: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, letterSpacing: '-0.02em' },
    input: { width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.surfaceAlt, color: T.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, outline: 'none' },
    textarea: { width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.surfaceAlt, color: T.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, outline: 'none', minHeight: 80, resize: 'vertical' },
    btn: (v) => ({ padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: v === 'primary' ? T.accent : T.surfaceAlt, color: v === 'primary' ? '#fff' : T.ink, transition: 'all 0.15s' }),
    label: { display: 'block', fontSize: 12, fontWeight: 600, color: T.inkMuted, marginBottom: 5, letterSpacing: '0.02em', textTransform: 'uppercase' },
    tag: (color) => ({ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${color}15`, color, border: `1px solid ${color}25` }),
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
    navItem: (active) => ({
      display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '10px 0' : '9px 14px',
      borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400,
      background: active ? T.accentSoft : 'transparent', color: active ? T.accent : T.inkMuted,
      border: active ? `1px solid ${T.accent}22` : '1px solid transparent',
      justifyContent: collapsed ? 'center' : 'flex-start', transition: 'all 0.15s',
    }),
  };

  // ─── RADAR DATA ──────────────────────────────────────────
  const radarData = useMemo(() => WEF_SKILLS.map(d => {
    const domain = data.skills?.find(s => s.domain === d.key);
    const items = domain?.items?.filter(i => i.name) || [];
    const avgC = items.length > 0 ? items.reduce((a, i) => a + i.current, 0) / items.length : 0;
    const avgT = items.length > 0 ? items.reduce((a, i) => a + i.target, 0) / items.length : 0;
    return { name: d.label.split(' ')[0], current: +avgC.toFixed(1), target: +avgT.toFixed(1) };
  }), [data.skills]);

  const aiRadarData = useMemo(() => (data.aiSkills || []).map(s => ({
    name: s.label?.split(' ')[0] || '', current: s.current, target: s.target,
  })), [data.aiSkills]);

  // ─── STRENGTH RING ───────────────────────────────────────
  const StrengthRing = ({ score, size = 130 }) => {
    const r = (size - 16) / 2, circ = 2 * Math.PI * r, offset = circ - (score / 100) * circ;
    const ringColor = score >= 80 ? T.emerald : score >= 50 ? T.accent : score >= 25 ? T.amber : T.rose;
    return (
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth="8" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={ringColor} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fontSize: 26, fontWeight: 800, fill: ringColor, fontFamily: "'Fraunces', serif" }}>{score}</text>
        <text x={size/2} y={size/2+16} textAnchor="middle" dominantBaseline="middle"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fontSize: 8, fill: T.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>STRENGTH</text>
      </svg>
    );
  };

  const SectionHead = ({ icon, title, subtitle }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h2 style={{ ...s.heading, fontSize: 24, margin: 0 }}>{title}</h2>
      </div>
      {subtitle && <p style={{ color: T.inkMuted, fontSize: 13, margin: 0, paddingLeft: 30 }}>{subtitle}</p>}
    </div>
  );

  // ─── BADGE SVG ───────────────────────────────────────────
  const BadgeVisual = ({ level, domain, size = 64 }) => {
    const badge = BADGE_LEVELS[level - 1] || BADGE_LEVELS[0];
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill={`${badge.color}30`} stroke={badge.color} strokeWidth="2.5" />
        <circle cx="50" cy="50" r="38" fill="none" stroke={badge.color} strokeWidth="1" opacity="0.5" />
        <text x="50" y="42" textAnchor="middle" fontSize="22" fill={badge.color}>{badge.icon}</text>
        <text x="50" y="62" textAnchor="middle" fontSize="9" fontWeight="700" fill={badge.color}>{badge.name.toUpperCase()}</text>
        <text x="50" y="74" textAnchor="middle" fontSize="7" fill={badge.color} opacity="0.7">L{badge.level}</text>
      </svg>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // SECTION RENDERERS
  // ═══════════════════════════════════════════════════════════

  const renderDashboard = () => {
    const filledSkills = (data.skills||[]).reduce((a, d) => a + (d.items||[]).filter(i => i.name).length, 0);
    const aiReady = (data.aiSkills||[]).filter(s => s.current >= 4).length;
    const avgEvStr = (data.competencies||[]).length > 0
      ? ((data.competencies||[]).reduce((a, c) => a + calcEvidenceStrength(c), 0) / data.competencies.length).toFixed(1) : '0';
    const totalBadge = getBadgeLevel((data.competencies||[]).length);

    const stats = [
      { label: 'Skills Mapped', value: filledSkills, color: T.accent },
      { label: 'AI Readiness', value: `${aiReady}/8`, color: T.teal },
      { label: 'Credentials', value: (data.certifications||[]).length, color: T.indigo },
      { label: 'Evidence', value: (data.competencies||[]).length, color: T.emerald },
      { label: 'Endorsements', value: (data.endorsements||[]).length, color: T.violet },
      { label: 'Badge Level', value: totalBadge.name, color: T.amber },
    ];

    const gapData = WEF_SKILLS.map(d => {
      const domain = data.skills?.find(sk => sk.domain === d.key);
      const items = domain?.items?.filter(i => i.name) || [];
      const avgC = items.length > 0 ? items.reduce((a, i) => a + i.current, 0) / items.length : 0;
      const avgT = items.length > 0 ? items.reduce((a, i) => a + i.target, 0) / items.length : 0;
      return { name: d.label.split('&')[0].trim().slice(0, 12), gap: +(avgT - avgC).toFixed(1), color: d.color };
    });

    return (
      <div>
        <SectionHead icon="⊡" title="Dashboard" subtitle="Your professional competency overview" />
        <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ ...s.card, flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 160 }}>
            <StrengthRing score={portfolioScore} />
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            {stats.map(st => (
              <div key={st.label} style={{ ...s.card, padding: 16, marginBottom: 0, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: st.color, fontFamily: "'Fraunces', serif" }}>{st.value}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.ink, marginTop: 2 }}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={s.grid2}>
          <div style={s.card}>
            <h3 style={{ ...s.heading, fontSize: 15, marginBottom: 12 }}>WEF 2030 Skills Radar</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={T.border} />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: T.inkMuted }} />
                <PolarRadiusAxis domain={[0, 6]} tick={{ fontSize: 8, fill: T.inkLight }} />
                <Radar name="Current" dataKey="current" stroke={T.accent} fill={T.accent} fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Target" dataKey="target" stroke={T.teal} fill={T.teal} fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="4 3" />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div style={s.card}>
            <h3 style={{ ...s.heading, fontSize: 15, marginBottom: 12 }}>Skills Gap Analysis</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={gapData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis type="number" domain={[0, 4]} tick={{ fontSize: 10, fill: T.inkMuted }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: T.inkMuted }} />
                <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="gap" radius={[0, 6, 6, 0]}>
                  {gapData.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.7} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    const p = data.profile || {};
    const handlePhoto = (e) => {
      const file = e.target.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => upd('profile.photo', ev.target.result);
      reader.readAsDataURL(file);
    };
    return (
      <div>
        <SectionHead icon="◉" title="Professional Profile" subtitle="Your identity and professional summary" />
        <div style={s.card}>
          <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
            <div onClick={() => fileRef.current?.click()} style={{ width: 90, height: 90, borderRadius: '50%', background: T.surfaceAlt, border: `2px dashed ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', flexShrink: 0 }}>
              {p.photo ? <img src={p.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 11, color: T.inkLight }}>+ Photo</span>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
            <div style={{ flex: 1, ...s.grid2 }}>
              <div><label style={s.label}>Full Name</label><input style={s.input} value={p.name||''} onChange={e => upd('profile.name', e.target.value)} /></div>
              <div><label style={s.label}>Title / Role</label><input style={s.input} value={p.title||''} onChange={e => upd('profile.title', e.target.value)} /></div>
            </div>
          </div>
          <div style={{ ...s.grid2, marginBottom: 16 }}>
            <div><label style={s.label}>Email</label><input style={s.input} value={p.email||''} onChange={e => upd('profile.email', e.target.value)} /></div>
            <div><label style={s.label}>Location</label><input style={s.input} value={p.location||''} onChange={e => upd('profile.location', e.target.value)} /></div>
            <div><label style={s.label}>Phone</label><input style={s.input} value={p.phone||''} onChange={e => upd('profile.phone', e.target.value)} /></div>
            <div><label style={s.label}>LinkedIn</label><input style={s.input} value={p.linkedin||''} onChange={e => upd('profile.linkedin', e.target.value)} /></div>
          </div>
          <div><label style={s.label}>Professional Summary</label>
            <textarea style={s.textarea} rows={4} value={p.summary||''} onChange={e => upd('profile.summary', e.target.value)} placeholder="Your professional identity, expertise, and vision..." /></div>
        </div>
      </div>
    );
  };

  const renderSkills = () => (
    <div>
      <SectionHead icon="⬡" title="WEF 2030 Skills Map" subtitle="Aligned with the World Economic Forum's 10 Core Skill Clusters for 2030" />
      <div style={{ ...s.card, marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke={T.border} /><PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: T.inkMuted }} />
            <PolarRadiusAxis domain={[0, 6]} tick={{ fontSize: 9, fill: T.inkLight }} />
            <Radar name="Current" dataKey="current" stroke={T.accent} fill={T.accent} fillOpacity={0.15} strokeWidth={2} />
            <Radar name="Target" dataKey="target" stroke={T.teal} fill={T.teal} fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="4 3" />
            <Legend wrapperStyle={{ fontSize: 11 }} /><Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {WEF_SKILLS.map((domain, di) => {
        const skillData = data.skills?.find(sk => sk.domain === domain.key);
        return (
          <div key={domain.key} style={{ ...s.card, borderLeft: `3px solid ${domain.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>{domain.icon}</span>
              <div><h3 style={{ ...s.heading, fontSize: 15, margin: 0 }}>{domain.label}</h3><p style={{ fontSize: 11, color: T.inkMuted, margin: 0 }}>{domain.desc}</p></div>
            </div>
            {skillData?.items?.map((item, ii) => (
              <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10, padding: '8px 0', borderBottom: `1px solid ${T.borderLight}` }}>
                <input style={{ ...s.input, flex: 1, maxWidth: 200 }} placeholder="Skill name" value={item.name||''}
                  onChange={e => { const next = JSON.parse(JSON.stringify(data.skills)); next[di].items[ii].name = e.target.value; upd('skills', next); }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                  <span style={{ color: T.inkMuted, width: 50 }}>Now: {item.current}</span>
                  <input type="range" min={1} max={6} value={item.current} style={{ width: 80, color: domain.color }}
                    onChange={e => { const next = JSON.parse(JSON.stringify(data.skills)); next[di].items[ii].current = +e.target.value; upd('skills', next); }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                  <span style={{ color: T.inkMuted, width: 52 }}>Target: {item.target}</span>
                  <input type="range" min={1} max={6} value={item.target} style={{ width: 80, color: T.teal }}
                    onChange={e => { const next = JSON.parse(JSON.stringify(data.skills)); next[di].items[ii].target = +e.target.value; upd('skills', next); }} />
                </div>
                <button onClick={() => { const next = JSON.parse(JSON.stringify(data.skills)); next[di].items.splice(ii, 1); upd('skills', next); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.inkLight, fontSize: 16 }}>×</button>
              </div>
            ))}
            <button onClick={() => { const next = JSON.parse(JSON.stringify(data.skills)); next[di].items.push({ id: uid(), name: '', current: 3, target: 5 }); upd('skills', next); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: domain.color, fontSize: 12, fontWeight: 600, padding: '6px 0' }}>+ Add skill</button>
          </div>
        );
      })}
    </div>
  );

  const renderAI = () => {
    const aiReady = (data.aiSkills||[]).filter(s => s.current >= 4).length;
    const avgProf = (data.aiSkills||[]).reduce((a, s) => a + s.current, 0) / (data.aiSkills||[]).length;
    return (
      <div>
        <SectionHead icon="◆" title="AI Readiness Index" subtitle="8-competency taxonomy for AI-age preparedness" />
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{ ...s.card, flex: 1, textAlign: 'center', marginBottom: 0 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: T.teal, fontFamily: "'Fraunces', serif" }}>{aiReady}/8</div>
            <div style={{ fontSize: 11, color: T.inkMuted }}>AI-Ready (Intermediate+)</div>
          </div>
          <div style={{ ...s.card, flex: 2, marginBottom: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, marginBottom: 8 }}>Average Proficiency</div>
            <div style={{ height: 10, background: T.surfaceAlt, borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ width: `${(avgProf / 6) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${T.teal}, ${T.accent})`, borderRadius: 5, transition: 'width 0.5s' }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.accent, marginTop: 4 }}>{avgProf.toFixed(1)} / 6.0</div>
          </div>
        </div>
        {(data.aiSkills||[]).map((skill, i) => {
          const level = PROFICIENCY_LEVELS.find(l => l.value === skill.current);
          return (
            <div key={skill.id} style={{ ...s.card, borderLeft: `3px solid ${level?.color || T.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>{skill.icon}</span><h3 style={{ ...s.heading, fontSize: 14, margin: 0 }}>{skill.label}</h3></div>
                  <p style={{ fontSize: 11, color: T.inkMuted, margin: '2px 0 0 28px' }}>{skill.desc}</p></div>
                <span style={s.tag(level?.color || T.inkLight)}>{level?.label || '—'}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
                <div style={{ flex: 1 }}><div style={{ fontSize: 11, color: T.inkMuted, marginBottom: 4 }}>Current: {skill.current}</div>
                  <input type="range" min={1} max={6} value={skill.current} style={{ width: '100%' }}
                    onChange={e => { const next = [...data.aiSkills]; next[i] = { ...next[i], current: +e.target.value }; upd('aiSkills', next); }} /></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 11, color: T.inkMuted, marginBottom: 4 }}>Target: {skill.target}</div>
                  <input type="range" min={1} max={6} value={skill.target} style={{ width: '100%' }}
                    onChange={e => { const next = [...data.aiSkills]; next[i] = { ...next[i], target: +e.target.value }; upd('aiSkills', next); }} /></div>
              </div>
              <textarea style={{ ...s.textarea, minHeight: 40 }} placeholder="Evidence or notes..." value={skill.evidence||''}
                onChange={e => { const next = [...data.aiSkills]; next[i] = { ...next[i], evidence: e.target.value }; upd('aiSkills', next); }} />
            </div>
          );
        })}
      </div>
    );
  };

  const renderBadges = () => {
    const domainEvidence = {};
    (data.competencies||[]).forEach(c => { const d = c.domain || 'general'; domainEvidence[d] = (domainEvidence[d] || 0) + 1; });
    return (
      <div>
        <SectionHead icon="★" title="Digital Badges" subtitle="Earn visual credentials as you build evidence of competence" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16 }}>
          {WEF_SKILLS.map(domain => {
            const count = domainEvidence[domain.key] || 0;
            const badge = getBadgeLevel(count);
            return (
              <div key={domain.key} style={{ ...s.card, textAlign: 'center', padding: 20, marginBottom: 0 }}>
                <BadgeVisual level={badge.level} domain={domain.key} size={68} />
                <h4 style={{ ...s.heading, fontSize: 11, margin: '8px 0 4px' }}>{domain.label.split('&')[0].trim()}</h4>
                <span style={s.tag(badge.color)}>{badge.name}</span>
                <p style={{ fontSize: 10, color: T.inkMuted, margin: '4px 0 0' }}>{count} evidence items</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCerts = () => (
    <div>
      <SectionHead icon="◈" title="Credentials" subtitle="Verified qualifications, licenses, and certifications" />
      {(data.certifications||[]).map((cert, i) => (
        <div key={cert.id} style={{ ...s.card, borderLeft: `3px solid ${T.indigo}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, ...s.grid2 }}>
              <div><label style={s.label}>Name</label><input style={s.input} value={cert.name||''} onChange={e => { const n = [...data.certifications]; n[i] = { ...n[i], name: e.target.value }; upd('certifications', n); }} /></div>
              <div><label style={s.label}>Issuer</label><input style={s.input} value={cert.issuer||''} onChange={e => { const n = [...data.certifications]; n[i] = { ...n[i], issuer: e.target.value }; upd('certifications', n); }} /></div>
              <div><label style={s.label}>Date</label><input style={s.input} type="date" value={cert.date||''} onChange={e => { const n = [...data.certifications]; n[i] = { ...n[i], date: e.target.value }; upd('certifications', n); }} /></div>
              <div><label style={s.label}>Credential ID</label><input style={s.input} value={cert.credId||''} onChange={e => { const n = [...data.certifications]; n[i] = { ...n[i], credId: e.target.value }; upd('certifications', n); }} /></div>
            </div>
            <button onClick={() => upd('certifications', data.certifications.filter((_, j) => j !== i))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.inkLight, fontSize: 18, marginLeft: 12 }}>×</button>
          </div>
        </div>
      ))}
      <button onClick={() => upd('certifications', [...(data.certifications||[]), { id: uid(), name: '', issuer: '', date: '', credId: '', domain: '' }])} style={s.btn('primary')}>+ Add Credential</button>
    </div>
  );

  const renderEvidence = () => (
    <div>
      <SectionHead icon="◇" title="Evidence Portfolio" subtitle="Document achievements with evidence strength scoring + ACRE evaluation" />
      {(data.competencies||[]).map((comp, i) => {
        const str = calcEvidenceStrength(comp); const acreAvg = calcAcreScore(comp);
        return (
          <div key={comp.id} style={{ ...s.card, borderLeft: `3px solid ${strengthColor(str)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={s.tag(strengthColor(str))}>Strength: {str}/5 — {strengthLabel(str)}</span>
                {acreAvg && <span style={s.tag(T.violet)}>ACRE: {acreAvg}/5</span>}
              </div>
              <button onClick={() => upd('competencies', data.competencies.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.inkLight, fontSize: 18 }}>×</button>
            </div>
            <div style={{ ...s.grid2, marginBottom: 12 }}>
              <div><label style={s.label}>Title</label><input style={s.input} value={comp.title||''} onChange={e => { const n = [...data.competencies]; n[i] = { ...n[i], title: e.target.value }; upd('competencies', n); }} /></div>
              <div><label style={s.label}>Type</label><select style={s.input} value={comp.type||''} onChange={e => { const n = [...data.competencies]; n[i] = { ...n[i], type: e.target.value }; upd('competencies', n); }}>
                <option value="">Select...</option>{EVIDENCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              <div><label style={s.label}>Domain</label><select style={s.input} value={comp.domain||''} onChange={e => { const n = [...data.competencies]; n[i] = { ...n[i], domain: e.target.value }; upd('competencies', n); }}>
                <option value="">Select...</option>{WEF_SKILLS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}</select></div>
              <div><label style={s.label}>Date</label><input style={s.input} type="date" value={comp.date||''} onChange={e => { const n = [...data.competencies]; n[i] = { ...n[i], date: e.target.value }; upd('competencies', n); }} /></div>
            </div>
            <div style={{ marginBottom: 10 }}><label style={s.label}>Description</label><textarea style={s.textarea} value={comp.description||''} placeholder="Describe the evidence..."
              onChange={e => { const n = [...data.competencies]; n[i] = { ...n[i], description: e.target.value }; upd('competencies', n); }} /></div>
            <div style={s.grid2}>
              <div><label style={s.label}>Context</label><textarea style={{ ...s.textarea, minHeight: 50 }} value={comp.context||''} placeholder="Situation..."
                onChange={e => { const n = [...data.competencies]; n[i] = { ...n[i], context: e.target.value }; upd('competencies', n); }} /></div>
              <div><label style={s.label}>Impact</label><textarea style={{ ...s.textarea, minHeight: 50 }} value={comp.impact||''} placeholder="Results..."
                onChange={e => { const n = [...data.competencies]; n[i] = { ...n[i], impact: e.target.value }; upd('competencies', n); }} /></div>
            </div>
            <div style={{ marginTop: 14, padding: 14, background: T.violetSoft, borderRadius: 10 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: T.violet, margin: '0 0 10px' }}>ACRE Quality Evaluation</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {ACRE_CRITERIA.map(c => (
                  <div key={c.key}><div style={{ fontSize: 10, fontWeight: 600, color: c.color, marginBottom: 4 }}>{c.icon} {c.label}</div>
                    <select style={{ ...s.input, padding: '6px 8px', fontSize: 11 }} value={comp[`acre_${c.key}`]||''}
                      onChange={e => { const n = [...data.competencies]; n[i] = { ...n[i], [`acre_${c.key}`]: +e.target.value }; upd('competencies', n); }}>
                      <option value="">Rate...</option>{[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
      <button onClick={() => upd('competencies', [...(data.competencies||[]), { id: uid(), title: '', description: '', type: '', domain: '', context: '', impact: '', date: '' }])} style={s.btn('primary')}>+ Add Evidence</button>
    </div>
  );

  const renderReflect = () => (
    <div>
      <SectionHead icon="◌" title="CARE Reflections" subtitle="Guided professional reflection with the CARE framework" />
      {(data.reflections||[]).map((ref, i) => (
        <div key={ref.id} style={s.card}>
          <div style={{ ...s.grid2, marginBottom: 12 }}>
            <div><label style={s.label}>Title</label><input style={s.input} value={ref.title||''} onChange={e => { const n = [...data.reflections]; n[i] = { ...n[i], title: e.target.value }; upd('reflections', n); }} /></div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}><label style={s.label}>Date</label><input style={s.input} type="date" value={ref.date||''} onChange={e => { const n = [...data.reflections]; n[i] = { ...n[i], date: e.target.value }; upd('reflections', n); }} /></div>
              <button onClick={() => upd('reflections', data.reflections.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.inkLight, fontSize: 18, marginBottom: 4 }}>×</button>
            </div>
          </div>
          {CARE_PROMPTS.map(p => (
            <div key={p.phase} style={{ marginBottom: 12 }}>
              <label style={{ ...s.label, color: p.color }}>{p.icon} {p.phase}: {p.prompt}</label>
              <textarea style={{ ...s.textarea, minHeight: 60 }} value={ref[p.phase.toLowerCase()]||''}
                onChange={e => { const n = [...data.reflections]; n[i] = { ...n[i], [p.phase.toLowerCase()]: e.target.value }; upd('reflections', n); }} />
            </div>
          ))}
        </div>
      ))}
      <button onClick={() => upd('reflections', [...(data.reflections||[]), { id: uid(), title: '', date: '', consider: '', analyze: '', reflect: '', evaluate: '' }])} style={s.btn('primary')}>+ Add CARE Reflection</button>
    </div>
  );

  const renderPlan = () => (
    <div>
      <SectionHead icon="▹" title="5-Year Growth Plan" subtitle="Map your professional trajectory" />
      <div style={s.card}>
        <div style={{ marginBottom: 16 }}><label style={s.label}>Vision Statement</label>
          <textarea style={s.textarea} value={data.plan?.vision||''} onChange={e => upd('plan.vision', e.target.value)} placeholder="Where do you see yourself in 5 years?" /></div>
        <div><label style={s.label}>Core Values</label>
          <input style={s.input} value={data.plan?.values||''} onChange={e => upd('plan.values', e.target.value)} placeholder="Innovation, Equity, Lifelong Learning..." /></div>
      </div>
      {(data.plan?.years||[]).map((y, i) => {
        const colors = [T.accent, T.teal, T.indigo, T.violet, T.emerald];
        return (
          <div key={y.year} style={{ ...s.card, borderLeft: `3px solid ${colors[i]}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ ...s.heading, fontSize: 15, margin: 0, color: colors[i] }}>Year {y.year}</h3>
              <select style={{ ...s.input, width: 'auto', padding: '4px 10px', fontSize: 11 }} value={y.status}
                onChange={e => { const n = JSON.parse(JSON.stringify(data.plan)); n.years[i].status = e.target.value; upd('plan', n); }}>
                <option value="planned">Planned</option><option value="in-progress">In Progress</option><option value="complete">Complete</option></select>
            </div>
            <div style={{ marginBottom: 10 }}><label style={s.label}>Goals</label>
              <textarea style={{ ...s.textarea, minHeight: 50 }} value={y.goals||''} onChange={e => { const n = JSON.parse(JSON.stringify(data.plan)); n.years[i].goals = e.target.value; upd('plan', n); }} /></div>
            <div style={s.grid2}>
              <div><label style={s.label}>Milestones</label><textarea style={{ ...s.textarea, minHeight: 50 }} value={y.milestones||''} onChange={e => { const n = JSON.parse(JSON.stringify(data.plan)); n.years[i].milestones = e.target.value; upd('plan', n); }} /></div>
              <div><label style={s.label}>Target Skills</label><textarea style={{ ...s.textarea, minHeight: 50 }} value={y.targetSkills||''} onChange={e => { const n = JSON.parse(JSON.stringify(data.plan)); n.years[i].targetSkills = e.target.value; upd('plan', n); }} /></div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderEndorse = () => (
    <div>
      <SectionHead icon="♦" title="Peer Endorsements" subtitle="Collect validation from colleagues and supervisors" />
      {(data.endorsements||[]).map((end, i) => (
        <div key={end.id} style={{ ...s.card, borderLeft: `3px solid ${T.emerald}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, ...s.grid2 }}>
              <div><label style={s.label}>Name</label><input style={s.input} value={end.name||''} onChange={e => { const n = [...data.endorsements]; n[i] = { ...n[i], name: e.target.value }; upd('endorsements', n); }} /></div>
              <div><label style={s.label}>Relationship</label><select style={s.input} value={end.relationship||''} onChange={e => { const n = [...data.endorsements]; n[i] = { ...n[i], relationship: e.target.value }; upd('endorsements', n); }}>
                <option value="">Select...</option><option>Supervisor</option><option>Colleague</option><option>Direct Report</option><option>Client</option><option>Mentor</option><option>Student</option></select></div>
              <div><label style={s.label}>Domain</label><select style={s.input} value={end.domain||''} onChange={e => { const n = [...data.endorsements]; n[i] = { ...n[i], domain: e.target.value }; upd('endorsements', n); }}>
                <option value="">Select...</option>{WEF_SKILLS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}</select></div>
              <div><label style={s.label}>Date</label><input style={s.input} type="date" value={end.date||''} onChange={e => { const n = [...data.endorsements]; n[i] = { ...n[i], date: e.target.value }; upd('endorsements', n); }} /></div>
            </div>
            <button onClick={() => upd('endorsements', data.endorsements.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.inkLight, fontSize: 18, marginLeft: 12 }}>×</button>
          </div>
          <div style={{ marginTop: 10 }}><label style={s.label}>Statement</label>
            <textarea style={s.textarea} value={end.statement||''} placeholder="What this person says about your competency..."
              onChange={e => { const n = [...data.endorsements]; n[i] = { ...n[i], statement: e.target.value }; upd('endorsements', n); }} /></div>
        </div>
      ))}
      <button onClick={() => upd('endorsements', [...(data.endorsements||[]), { id: uid(), name: '', relationship: '', domain: '', date: '', statement: '' }])} style={s.btn('primary')}>+ Add Endorsement</button>
    </div>
  );

  const renderPreview = () => {
    const p = data.profile || {};
    return (
      <div>
        <SectionHead icon="◻" title="Portfolio Preview" subtitle="How your portfolio appears to reviewers" />
        <div style={{ ...s.card, background: T.gradientHero, color: '#fff', padding: 32, borderRadius: 16 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {p.photo && <img src={p.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.2)' }} />}
            <div><h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, margin: 0, fontWeight: 800 }}>{p.name || 'Your Name'}</h1>
              <p style={{ fontSize: 15, margin: '4px 0 0', opacity: 0.85 }}>{p.title || 'Your Title'}</p></div>
            <div style={{ marginLeft: 'auto' }}><StrengthRing score={portfolioScore} size={90} /></div>
          </div>
          {p.summary && <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 16, opacity: 0.9 }}>{p.summary}</p>}
        </div>
        <div style={s.grid2}>
          <div style={s.card}><h3 style={{ ...s.heading, fontSize: 14, marginBottom: 8 }}>Skills Profile</h3>
            <ResponsiveContainer width="100%" height={200}><RadarChart data={radarData}><PolarGrid stroke={T.border} /><PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: T.inkMuted }} /><PolarRadiusAxis domain={[0, 6]} tick={false} /><Radar dataKey="current" stroke={T.accent} fill={T.accent} fillOpacity={0.2} strokeWidth={2} /></RadarChart></ResponsiveContainer></div>
          <div style={s.card}><h3 style={{ ...s.heading, fontSize: 14, marginBottom: 8 }}>AI Readiness</h3>
            <ResponsiveContainer width="100%" height={200}><RadarChart data={aiRadarData}><PolarGrid stroke={T.border} /><PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: T.inkMuted }} /><PolarRadiusAxis domain={[0, 6]} tick={false} /><Radar dataKey="current" stroke={T.teal} fill={T.teal} fillOpacity={0.2} strokeWidth={2} /></RadarChart></ResponsiveContainer></div>
        </div>
      </div>
    );
  };

  const renderTab = () => {
    switch (tab) {
      case 'dashboard': return renderDashboard();
      case 'profile': return renderProfile();
      case 'skills': return renderSkills();
      case 'ai': return renderAI();
      case 'badges': return renderBadges();
      case 'certs': return renderCerts();
      case 'evidence': return renderEvidence();
      case 'reflect': return renderReflect();
      case 'plan': return renderPlan();
      case 'endorse': return renderEndorse();
      case 'preview': return renderPreview();
      default: return renderDashboard();
    }
  };

  // ─── LAYOUT ──────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 14, transition: 'background 0.3s, color 0.3s' }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <aside style={{ width: collapsed ? 60 : 220, minWidth: collapsed ? 60 : 220, background: T.surface, borderRight: `1px solid ${T.border}`, padding: collapsed ? '16px 8px' : '20px 16px', display: 'flex', flexDirection: 'column', gap: 2, transition: 'all 0.25s ease', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', boxShadow: T.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
          {!collapsed && <div><div style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 16, color: T.accent, letterSpacing: '-0.03em' }}>CompetencyFolio</div>
            <div style={{ fontSize: 9, color: T.inkLight, letterSpacing: '0.08em', textTransform: 'uppercase' }}>v3 · WEF 2030</div></div>}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.inkMuted, fontSize: 14, padding: 4 }}>{collapsed ? '▸' : '◂'}</button>
        </div>

        {!collapsed && user && <div style={{ fontSize: 12, color: T.inkMuted, marginBottom: 12, padding: '0 4px' }}>Welcome, <strong style={{ color: T.ink }}>{user.name?.split(' ')[0]}</strong></div>}

        {TABS.map(t => <div key={t.id} style={s.navItem(tab === t.id)} onClick={() => setTab(t.id)}><span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{t.icon}</span>{!collapsed && <span>{t.label}</span>}</div>)}

        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Save status */}
          {!collapsed && (
            <div style={{ fontSize: 10, color: saveStatus === 'saved' ? T.emerald : saveStatus === 'saving' ? T.amber : T.rose, padding: '4px 14px', marginBottom: 4 }}>
              {saveStatus === 'saved' ? '✓ Saved' : saveStatus === 'saving' ? '⟳ Saving...' : '✗ Save error'}
              {lastSaved && saveStatus === 'saved' && <span style={{ color: T.inkLight, marginLeft: 4 }}>{lastSaved.toLocaleTimeString()}</span>}
            </div>
          )}
          <div style={s.navItem(false)} onClick={() => setDarkMode(!darkMode)}>{!collapsed && <span style={{ fontSize: 12 }}>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}<span style={{ fontSize: 14 }}>{darkMode ? '☀️' : '🌙'}</span></div>
          <div style={s.navItem(false)} onClick={onShare}>{!collapsed && <span style={{ fontSize: 12 }}>Share Portfolio</span>}<span style={{ fontSize: 14 }}>🔗</span></div>
          <div style={s.navItem(false)} onClick={onExport}>{!collapsed && <span style={{ fontSize: 12 }}>Export JSON</span>}<span style={{ fontSize: 14 }}>↓</span></div>
          <div style={s.navItem(false)} onClick={() => importRef.current?.click()}>{!collapsed && <span style={{ fontSize: 12 }}>Import JSON</span>}<span style={{ fontSize: 14 }}>↑</span></div>
          <input ref={importRef} type="file" accept=".json" hidden onChange={onImport} />
          <div style={{ ...s.navItem(false), color: T.rose }} onClick={onLogout}>{!collapsed && <span style={{ fontSize: 12 }}>Sign Out</span>}<span style={{ fontSize: 14 }}>⏻</span></div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '28px 36px', maxWidth: 960, margin: '0 auto' }}>
        {renderTab()}
        <div style={{ textAlign: 'center', padding: '32px 0 16px', borderTop: `1px solid ${T.borderLight}`, marginTop: 40 }}>
          <p style={{ fontSize: 10, color: T.inkLight }}>COMPETENCYFOLIO v3 · Created by Dr. Rohan Jowallah · WEF 2030 · CARE · ACRE · CRAFT</p>
        </div>
      </main>
    </div>
  );
}
