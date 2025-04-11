import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// __dirname workaround (Next.js uses ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve the actual path to ml-model/predict.py
const predictScriptPath = path.resolve(__dirname, "../../../../../ml-model/predict.py");

const runPythonPrediction = (description: string): Promise<{ scam_probability: number; flagged: boolean }> => {
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
            if (code !== 0) {
                return reject(new Error(error || "Python script failed"));
            }

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
    try {
        const { description } = await req.json();

        if (!description || description.trim() === "") {
            return NextResponse.json({ message: "Description is required" }, { status: 400 });
        }

        const result = await runPythonPrediction(description);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Prediction error:", error);
        return NextResponse.json({ message: "Prediction failed", error: error.message }, { status: 500 });
    }
}
