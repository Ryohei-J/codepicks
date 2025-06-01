import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Article = {
    site: "Qiita" | "Zenn";
    title: string;
    link: string;
    pubDate: string;
};

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "data", "articles.json");
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const articles: Article[] = JSON.parse(fileContent);

        return NextResponse.json(articles);
    } catch (error) {
        console.error("Error reading articles:", error);
        return NextResponse.json(
            { error: "Failed to fetch articles" },
            { status: 500 }
        );
    }
} 