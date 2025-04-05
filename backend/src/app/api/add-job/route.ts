import { NextRequest, NextResponse } from "next/server";
import pool from "../../lib/db";

// Dummy scam detector (replace with real model call)
function isScam(description: string): { scam_probability: number, flagged: boolean } {
    const scamWords = ["earn money fast", "limited seats", "no experience needed"];
    const lowerDesc = description.toLowerCase();
    const match = scamWords.some(word => lowerDesc.includes(word));
    return {
        scam_probability: match ? 90.0 : 10.0,
        flagged: match
    };
}

export async function POST(req: NextRequest) {
    const data = await req.json();
    const { title, company, location, description, url } = data;

    try {
        const client = await pool.connect();

        // Check if already in DB
        const existing = await client.query("SELECT * FROM job_listings WHERE url = $1", [url]);
        if (existing.rows.length > 0) {
            client.release();
            return NextResponse.json({
                message: "Already Exists",
                flagged: existing.rows[0].flagged,
                scam_probability: existing.rows[0].scam_probability
            });
        }

        // Get ML prediction
        const { scam_probability, flagged } = isScam(description);

        // Insert into DB
        await client.query(
            `INSERT INTO job_listings (title, company, location, description, url, scam_probability, flagged) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [title, company, location, description, url, scam_probability, flagged]
        );

        client.release();
        return NextResponse.json({
            message: "Scanned and Saved",
            flagged,
            scam_probability
        });

    } catch (error) {
        console.error("Add job error:", error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
