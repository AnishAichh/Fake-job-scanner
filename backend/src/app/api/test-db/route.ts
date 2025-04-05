import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
export async function GET() {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT NOW()");
        client.release();

        return NextResponse.json({ message: "Database Connected Successfully", time: result.rows[0].now });
    } catch (error) {
        return NextResponse.json(
            { message: "Database Connection Failed", error: (error as Error).message },
            { status: 500 }
        );
    }
}
