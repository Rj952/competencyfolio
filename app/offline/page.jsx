'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🌊</div>
        <h1 className="heading-display text-2xl text-brand-700 mb-3">You&apos;re Offline</h1>
        <p className="text-stone-500 text-sm mb-6">
          CompetencyFolio needs an internet connection to sync your portfolio data.
          Please check your connection and try again.
        </p>
        <button
          onClick={() => typeof window !== 'undefined' && window.location.reload()}
          className="btn-primary text-sm px-6 py-2.5 rounded-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
