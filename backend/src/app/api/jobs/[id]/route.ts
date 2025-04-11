import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const jobId = context.params.id;

    try {
        const result = await pool.query("SELECT * FROM job_listings WHERE id = $1", [jobId]);

        if (result.rows.length === 0) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching job:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
