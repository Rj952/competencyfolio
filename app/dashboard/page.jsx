'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PortfolioApp from '@/components/portfolio/PortfolioApp';
import { getDefaultPortfolio } from '@/lib/constants';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved'); // saved | saving | error
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimerRef = useRef(null);
  const router = useRouter();

  // Load user and portfolio on mount
  useEffect(() => {
    async function load() {
      try {
        const [userRes, portfolioRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/portfolio'),
        ]);

        if (!userRes.ok) {
          router.push('/login');
          return;
        }

        const userData = await userRes.json();
        setUser(userData.user);

        if (portfolioRes.ok) {
          const pData = await portfolioRes.json();
          setPortfolioData(pData.data || getDefaultPortfolio());
          if (pData.lastSavedAt) setLastSaved(new Date(pData.lastSavedAt));
        } else {
          setPortfolioData(getDefaultPortfolio());
        }
      } catch (err) {
        console.error('Failed to load:', err);
        setPortfolioData(getDefaultPortfolio());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  // Auto-save with debounce
  const savePortfolio = useCallback(async (data) => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      if (res.ok) {
        const result = await res.json();
        setSaveStatus('saved');
        setLastSaved(new Date(result.lastSavedAt));
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  }, []);

  const handleDataChange = useCallback((newData) => {
    setPortfolioData(newData);
    setSaveStatus('saving');

    // Debounce save - wait 2 seconds after last change
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      savePortfolio(newData);
    }, 2000);
  }, [savePortfolio]);

  // Logout
  const handleLogout = async () => {
    // Save before logout
    if (portfolioData) {
      await savePortfolio(portfolioData);
    }
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  // Export JSON
  const handleExport = () => {
    if (!portfolioData) return;
    const blob = new Blob([JSON.stringify(portfolioData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competencyfolio-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        const merged = { ...getDefaultPortfolio(), ...imported };
        handleDataChange(merged);
      } catch {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  // Generate share link
  const handleShare = async () => {
    try {
      // Save first
      await savePortfolio(portfolioData);
      const res = await fetch('/api/portfolio/share', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const url = `${window.location.origin}${data.url}`;
        await navigator.clipboard.writeText(url);
        alert(`Share link copied to clipboard!\n\n${url}`);
      }
    } catch {
      alert('Failed to create share link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="heading-display text-2xl text-brand-700 mb-3">CompetencyFolio</div>
          <div className="text-sm text-stone-400">Loading your portfolio...</div>
        </div>
      </div>
    );
  }

  return (
    <PortfolioApp
      data={portfolioData}
      user={user}
      onDataChange={handleDataChange}
      onLogout={handleLogout}
      onExport={handleExport}
      onImport={handleImport}
      onShare={handleShare}
      saveStatus={saveStatus}
      lastSaved={lastSaved}
    />
  );
}
