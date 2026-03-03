import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="heading-display text-6xl text-stone-300 mb-4">404</h1>
        <h2 className="heading-display text-xl text-stone-900 mb-3">Portfolio Not Found</h2>
        <p className="text-sm text-stone-500 mb-8">
          This portfolio link may have been deactivated or doesn't exist.
        </p>
        <Link href="/" className="btn-primary px-8 py-3 rounded-xl inline-block no-underline">
          Build Your Own Portfolio →
        </Link>
      </div>
    </div>
  );
}
