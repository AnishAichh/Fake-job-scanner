import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to ScamGuard Jobs</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-xl">
        A LinkedIn-style job board that helps you identify scam or fake job listings with real-time AI-based scam detection.
      </p>
      <Link
        href="/jobs"
        className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
      >
        Browse Jobs
      </Link>
    </main>
  );
}
