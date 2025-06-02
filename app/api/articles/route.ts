import { NextResponse } from "next/server";
import Parser from "rss-parser";

type Article = {
    site: "Qiita" | "Zenn" | "Hatena";
    title: string;
    link: string;
    pubDate: string;
};

const qiitaFeedUrl = "https://qiita.com/tags/typescript/feed";
const zennFeedUrl = "https://zenn.dev/feed";
const hatenaFeedUrl = "https://b.hatena.ne.jp/hotentry/it.rss";

async function fetchFeed(url: string, site: "Qiita" | "Zenn" | "Hatena"): Promise<Article[]> {
    try {
        const parser = new Parser();
        const feed = await parser.parseURL(url);
        return feed.items.map((item) => ({
            site,
            title: item.title ?? "",
            link: item.link ?? "",
            pubDate: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
        }));
    } catch (error) {
        console.error(`Error fetching ${site} feed:`, error);
        return [];
    }
}

export async function GET() {
    try {
        const [qiitaArticles, zennArticles, hatenaArticles] = await Promise.all([
            fetchFeed(qiitaFeedUrl, "Qiita"),
            fetchFeed(zennFeedUrl, "Zenn"),
            fetchFeed(hatenaFeedUrl, "Hatena"),
        ]);

        const allArticles = [...qiitaArticles, ...zennArticles, ...hatenaArticles].sort(
            (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        );

        return NextResponse.json(allArticles);
    } catch (error) {
        console.error("Error fetching articles:", error);
        return NextResponse.json(
            { error: "Failed to fetch articles" },
            { status: 500 }
        );
    }
} 