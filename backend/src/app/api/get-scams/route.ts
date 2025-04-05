import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
    try {
        // Fetch all scam reports
        const result = await pool.query("SELECT * FROM scam_database ORDER BY created_at DESC");

        return NextResponse.json({ scams: result.rows });
    } catch (error) {
        console.error("Error fetching scams:", error);
        return NextResponse.json({ message: "Failed to fetch scams", error: (error as Error).message }, { status: 500 });
    }
}
