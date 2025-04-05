import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST(req: Request) {
    try {
        const { title, company, location, description, url, reported_by, report_reason } = await req.json();

        // Insert the scam report into scam_database
        const query = `
            INSERT INTO scam_database (title, company, location, description, url, reported_by, report_reason) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [title, company, location, description, url, reported_by, report_reason];

        const result = await pool.query(query, values);

        return NextResponse.json({ message: "Scam reported successfully", scam: result.rows[0] });
    } catch (error) {
        console.error("Error reporting scam:", error);
        return NextResponse.json({ message: "Failed to report scam", error: (error as Error).message }, { status: 500 });
    }
}
