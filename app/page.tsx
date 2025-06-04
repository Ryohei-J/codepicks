import React from "react";
import { Metadata } from "next";
import Link from "next/link";

type Article = {
    site: "Qiita" | "Zenn" | "Hatena";
    title: string;
    link: string;
    pubDate: string;
};

type Pagination = {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
};

async function getArticles(tag?: string, page: number = 1): Promise<{ articles: Article[]; pagination: Pagination }> {
    const baseUrl = typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        : "";
    const url = tag
        ? `${baseUrl}/api/search?tag=${encodeURIComponent(tag)}&page=${page}`
        : `${baseUrl}/api/articles`;
    const res = await fetch(url, {
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch articles");
    }
    const data = await res.json();

    // 通常の記事一覧の場合（paginationがない場合）
    if (!data.pagination) {
        return {
            articles: data,
            pagination: {
                total: data.length,
                page: 1,
                perPage: data.length,
                totalPages: 1,
            },
        };
    }

    return data;
}

export const metadata: Metadata = {
    title: "CodePicks",
};

export default async function Home({
    searchParams,
}: {
    searchParams: { tag?: string; page?: string };
}) {
    const tag = searchParams.tag;
    const page = parseInt(searchParams.page ?? "1");
    const { articles, pagination } = await getArticles(tag, page);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <a
                            href="/"
                            className="flex items-center gap-2 text-4xl font-bold text-gray-900 dark:text-white cursor-pointer"
                            style={{ cursor: 'pointer' }}
                            aria-label="ホームに戻る"
                        >
                            <img src="/logo.png" alt="CodePicksロゴ" className="w-8 h-8" />
                            CodePicks
                        </a>
                        <div className="flex items-center gap-4">
                            <button
                                id="search-toggle"
                                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                aria-label="検索"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                            <button
                                id="theme-toggle"
                                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                aria-label="テーマ切り替え"
                            >
                                <svg
                                    id="theme-toggle-dark-icon"
                                    className="hidden w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                                <svg
                                    id="theme-toggle-light-icon"
                                    className="hidden w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div
                        id="search-container"
                        className="hidden mt-4 transition-all duration-200 ease-in-out"
                    >
                        <form className="flex gap-2" action="/">
                            <input
                                type="text"
                                name="tag"
                                placeholder="タグを入力（例: typescript）"
                                defaultValue={tag}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                検索
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article, index) => (
                        <article
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 dark:border-gray-700 h-[180px]"
                        >
                            <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors h-full"
                            >
                                <div className="p-6 h-full flex flex-col">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span
                                            className={`px-3 py-1 text-sm font-medium rounded-full ${article.site === "Qiita"
                                                ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                : article.site === "Zenn"
                                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                                    : "bg-[#00A5DE]/10 text-[#00A5DE] dark:bg-[#00A5DE]/20 dark:text-[#00A5DE]"
                                                }`}
                                        >
                                            {article.site}
                                        </span>
                                        <time className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(article.pubDate).toLocaleDateString("ja-JP", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </time>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex-grow line-clamp-2">
                                        {article.title}
                                    </h2>
                                </div>
                            </a>
                        </article>
                    ))}
                </div>

                {pagination.totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <Link
                                key={pageNum}
                                href={`/?tag=${tag}&page=${pageNum}`}
                                className={`px-4 py-2 rounded-lg ${pageNum === pagination.page
                                    ? "bg-blue-600 text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {pageNum}
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                            © 2025 CodePicks. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>

            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        const themeToggleBtn = document.getElementById('theme-toggle');
                        const darkIcon = document.getElementById('theme-toggle-dark-icon');
                        const lightIcon = document.getElementById('theme-toggle-light-icon');
                        const searchToggleBtn = document.getElementById('search-toggle');
                        const searchContainer = document.getElementById('search-container');

                        // 初期状態の設定
                        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                            document.documentElement.classList.add('dark');
                            darkIcon.classList.add('hidden');
                            lightIcon.classList.remove('hidden');
                        } else {
                            document.documentElement.classList.remove('dark');
                            darkIcon.classList.remove('hidden');
                            lightIcon.classList.add('hidden');
                        }

                        // テーマ切り替え
                        themeToggleBtn.addEventListener('click', () => {
                            if (document.documentElement.classList.contains('dark')) {
                                document.documentElement.classList.remove('dark');
                                localStorage.theme = 'light';
                                darkIcon.classList.remove('hidden');
                                lightIcon.classList.add('hidden');
                            } else {
                                document.documentElement.classList.add('dark');
                                localStorage.theme = 'dark';
                                darkIcon.classList.add('hidden');
                                lightIcon.classList.remove('hidden');
                            }
                        });

                        // 検索フォームの表示/非表示
                        searchToggleBtn.addEventListener('click', () => {
                            searchContainer.classList.toggle('hidden');
                            if (!searchContainer.classList.contains('hidden')) {
                                searchContainer.querySelector('input')?.focus();
                            }
                        });

                        // 検索フォームの外側をクリックしたら閉じる
                        document.addEventListener('click', (e) => {
                            if (!searchContainer.classList.contains('hidden') &&
                                !searchContainer.contains(e.target) &&
                                !searchToggleBtn.contains(e.target)) {
                                searchContainer.classList.add('hidden');
                            }
                        });
                    `,
                }}
            />
        </div>
    );
} 