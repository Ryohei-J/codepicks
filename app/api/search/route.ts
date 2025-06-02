import { NextResponse } from "next/server";
import Parser from "rss-parser";

type Article = {
    site: "Qiita" | "Zenn";
    title: string;
    link: string;
    pubDate: string;
};

async function fetchQiitaArticles(tag: string): Promise<Article[]> {
    try {
        const token = process.env.QIITA_TOKEN;
        if (!token) {
            console.error("QIITA_TOKEN is not set");
            return [];
        }

        const res = await fetch(`https://qiita.com/api/v2/tags/${tag}/items`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            console.error(`Qiita API error: ${res.status}`);
            return [];
        }

        const items = await res.json();
        return items.map((item: any) => ({
            site: "Qiita",
            title: item.title,
            link: item.url,
            pubDate: item.created_at,
        }));
    } catch (error) {
        console.error("Error fetching Qiita articles:", error);
        return [];
    }
}

async function fetchZennArticles(tag: string): Promise<Article[]> {
    try {
        const parser = new Parser();
        const encodedTag = encodeURIComponent(tag);
        const feed = await parser.parseURL(`https://zenn.dev/topics/${encodedTag}/feed`);
        return feed.items.map((item) => ({
            site: "Zenn",
            title: item.title ?? "",
            link: item.link ?? "",
            pubDate: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching Zenn articles:", error);
        return [];
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const page = parseInt(searchParams.get("page") ?? "1");
    const perPage = 12;

    if (!tag) {
        return NextResponse.json({ error: "Tag is required" }, { status: 400 });
    }

    try {
        const [qiitaArticles, zennArticles] = await Promise.all([
            fetchQiitaArticles(tag),
            fetchZennArticles(tag),
        ]);

        const allArticles = [...qiitaArticles, ...zennArticles].sort(
            (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        );

        const total = allArticles.length;
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const paginatedArticles = allArticles.slice(start, end);

        return NextResponse.json({
            articles: paginatedArticles,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage),
            },
        });
    } catch (error) {
        console.error("Error fetching articles:", error);
        return NextResponse.json(
            { error: "Failed to fetch articles" },
            { status: 500 }
        );
    }
} 