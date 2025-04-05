import { NextRequest, NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const jobUrl = searchParams.get("url");

        if (!jobUrl) {
            return NextResponse.json({ message: "URL is required" }, { status: 400 });
        }

        const client = await pool.connect();
        const result = await client.query(
            "SELECT * FROM job_listings WHERE url = $1",
            [jobUrl]
        );
        client.release();

        if (result.rows.length > 0) {
            return NextResponse.json({ found: true, ...result.rows[0] });
        } else {
            return NextResponse.json({ found: false });
        }
    } catch (error) {
        console.error("Error fetching job:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
