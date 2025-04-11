"use client";
import { useState } from "react";
export default function AdminScamPredictor() {
    const [description, setDescription] = useState("");
    const [result, setResult] = useState<null | { scam_probability: number; flagged: boolean }>(null);
    const [error, setError] = useState("");

    const handlePredict = async () => {
        setResult(null);
        setError("");
        try {
            const res = await fetch("/api/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description })
            });
            if (!res.ok) throw new Error("Prediction failed");
            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-4">Scam Detection Tester</h1>

            <textarea
                rows={6}
                className="w-full p-2 border rounded mb-4"
                placeholder="Paste job description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handlePredict}
            >
                Scan for Scam
            </button>

            {result && (
                <div className="mt-6 p-4 border rounded bg-gray-100 text-black">
                    <p><strong>Scam Probability:</strong> {result.scam_probability}%</p>
                    <p><strong>Flagged:</strong> {result.flagged ? "⚠️ Scam" : "✅ Safe"}</p>
                </div>
            )}
            {error && (
                <p className="mt-4 text-red-500 font-medium">Error: {error}</p>
            )}
        </div>
    );
}
