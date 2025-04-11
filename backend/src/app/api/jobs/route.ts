import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

// GET all jobs
export async function GET() {
    try {
        const result = await pool.query("SELECT * FROM job_listings ORDER BY created_at DESC");
        return NextResponse.json({ jobs: result.rows });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch jobs", error }, { status: 500 });
    }
}

// POST new job
export async function POST(req: NextRequest) {
    try {
        const { title, company, location, description, url, scam_probability, flagged } =
            await req.json();

        const result = await pool.query(
            `INSERT INTO job_listings (title, company, location, description, url, scam_probability, flagged)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [title, company, location, description, url, scam_probability, flagged]
        );

        return NextResponse.json({ message: "Job created", job: result.rows[0] });
    } catch (error) {
        console.error("POST /api/jobs error:", error);
        return NextResponse.json({ message: "Job creation failed", error }, { status: 500 });
    }
}
