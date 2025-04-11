import { notFound } from "next/navigation";

// Fetch job by ID
const getJob = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/jobs/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
};

export default async function JobDetailPage({ params }: { params: { id: string } }) {
    const job = await getJob(params.id);

    if (!job) {
        return (
            <div className="p-6 max-w-2xl mx-auto text-center">
                <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
                <p className="text-gray-600">
                    This job was not found in the database. Use the Scam Detector Extension to scan this job.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold job-title">{job.title}</h1>
            <p className="text-gray-700 job-company">{job.company} — {job.location}</p>
            <p className="text-gray-600 job-description mt-4">{job.description}</p>

            <p className="mt-6 text-sm text-gray-400 italic">
                Run the <strong>Scam Detector Chrome Extension</strong> to check if this job is a scam.
            </p>
        </div>
    );
}
