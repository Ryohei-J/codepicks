import Parser from "rss-parser";
import fs from "fs";
import path from "path";

type Article = {
    site: "Qiita" | "Zenn";
    title: string;
    link: string;
    pubDate: string;
};

type CustomItem = {
    title?: string;
    link?: string;
    pubDate?: string;
};

const parser = new Parser<CustomItem>();

const qiitaFeedUrl = "https://qiita.com/popular-items/feed";
const zennFeedUrl = "https://zenn.dev/feed";

async function fetchFeed(url: string, site: Article["site"]): Promise<Article[]> {
    const feed = await parser.parseURL(url);
    return feed.items.slice(0, 10).map((item) => ({
        site,
        title: item.title ?? "",
        link: item.link ?? "",
        pubDate: item.pubDate ?? "",
    }));
}

async function main(): Promise<void> {
    const qiita = await fetchFeed(qiitaFeedUrl, "Qiita");
    const zenn = await fetchFeed(zennFeedUrl, "Zenn");
    const all = [...qiita, ...zenn].sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );
    const outputPath = path.join(__dirname, "..", "data", "articles.json");
    fs.writeFileSync(outputPath, JSON.stringify(all, null, 2));
    console.log("✅ Saved to data/articles.json");
}

main();
