import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ✅ FIX: Destructure `jobs` from the response
const getJobs = async () => {
    const res = await fetch("http://localhost:3000/api/jobs", { cache: "no-store" });
    if (!res.ok) return [];

    const data = await res.json();
    return data.jobs; // ✅ important: only return the jobs array
};

export default async function JobsPage() {
    const jobs = await getJobs();

    return (
        <div className="bg-black text-white min-h-screen px-6 py-8 flex justify-center">
            <div className="w-full max-w-6xl flex gap-6">
                {/* LEFT SIDEBAR */}
                <aside className="w-[280px] bg-[#1d2226] rounded-md p-4 sticky top-8 self-start h-fit">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-20 h-20 bg-gray-600 rounded-full mb-2 flex items-center justify-center text-2xl text-white">
                            <span>A</span>
                        </div>
                        <div>
                            <p className="font-semibold">Alex Johnson</p>
                            <p className="text-sm text-gray-400">Software Developer • India</p>
                        </div>
                    </div>

                    <div className="text-sm space-y-4">
                        <div className="space-y-1">
                            <p className="text-gray-300 hover:underline cursor-pointer">Preferences</p>
                            <p className="text-gray-300 hover:underline cursor-pointer">My jobs</p>
                            <p className="text-gray-300 hover:underline cursor-pointer">My Career Insights</p>
                        </div>

                        <Link
                            href="/jobs/new"
                            className="block mt-2 text-blue-500 hover:underline font-medium"
                        >
                            + Post a free job
                        </Link>
                    </div>
                </aside>

                {/* JOB LIST SECTION */}
                <main className="flex-1">
                    <h1 className="text-xl font-semibold mb-6">Top picks for you</h1>

                    {jobs.length === 0 ? (
                        <p className="text-gray-400">No job listings found.</p>
                    ) : (
                        <div className="space-y-4">
                            {jobs.map((job: any) => (
                                <Card key={job.id} className="bg-[#1d2226] border-none text-white">
                                    <CardHeader>
                                        <CardTitle className="text-base font-semibold text-blue-400">
                                            {job.title}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-sm text-gray-300 mb-1">
                                            {job.company} • {job.location}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {job.description?.slice(0, 120)}...
                                        </p>

                                        <Link
                                            href={`/jobs/${job.id}`}
                                            className="text-sm text-blue-500 hover:underline mt-3 inline-block"
                                        >
                                            View Details
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
