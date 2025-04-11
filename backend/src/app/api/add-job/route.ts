import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Absolute path to predict.py
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const predictScriptPath = path.resolve(__dirname, "../../../../../ml-model/predict.py");

const runMLModel = (description: string): Promise<{ scam_probability: number; flagged: boolean }> => {
    return new Promise((resolve, reject) => {
        const process = spawn("python", [predictScriptPath, description]);

        let data = "";
        let error = "";

        process.stdout.on("data", (chunk) => {
            data += chunk;
        });

        process.stderr.on("data", (chunk) => {
            error += chunk;
        });

        process.on("close", (code) => {
            if (code !== 0) return reject(new Error(error || "Python script failed"));
            try {
                const result = JSON.parse(data);
                resolve(result);
            } catch (e) {
                reject(new Error("Failed to parse ML result"));
            }
        });
    });
};

export async function POST(req: NextRequest) {
    const data = await req.json();
    const { id, title, company, location, description, url } = data;

    try {
        const client = await pool.connect();

        const existing = await client.query("SELECT * FROM job_listings WHERE id = $1", [id]);

        // Case 1: Job exists and has complete scam data
        if (existing.rows.length > 0) {
            const job = existing.rows[0];

            if (job.scam_probability !== null && job.flagged !== null) {
                client.release();
                return NextResponse.json({
                    message: "Job already exists",
                    flagged: job.flagged,
                    scam_probability: job.scam_probability
                });
            }

            // Case 2: Job exists, but missing scam data → run model and update
            const { scam_probability, flagged } = await runMLModel(description);

            await client.query(
                `UPDATE job_listings SET scam_probability = $1, flagged = $2 WHERE id = $3`,
                [scam_probability, flagged, id]
            );

            client.release();
            return NextResponse.json({
                message: "Job updated with scam detection",
                flagged,
                scam_probability
            });
        }

        // Case 3: Job is completely new → run model and insert
        const { scam_probability, flagged } = await runMLModel(description);

        await client.query(
            `INSERT INTO job_listings (id, title, company, location, description, url, scam_probability, flagged) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [id, title, company, location, description, url, scam_probability, flagged]
        );

        client.release();
        return NextResponse.json({ message: "Job added", scam_probability, flagged });

    } catch (error: any) {
        console.error("Add job error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
