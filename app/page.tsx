import React from "react";
import { Metadata } from "next";

type Article = {
    site: "Qiita" | "Zenn";
    title: string;
    link: string;
    pubDate: string;
};

async function getArticles(): Promise<Article[]> {
    const res = await fetch("http://localhost:3000/api/articles", {
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch articles");
    }
    return res.json();
}

export const metadata: Metadata = {
    title: "CodePicks",
};

export default async function Home() {
    const articles = await getArticles();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            CodePicks
                        </h1>
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
                                                : "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
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
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex-grow">
                                        {article.title}
                                    </h2>
                                </div>
                            </a>
                        </article>
                    ))}
                </div>
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
                    `,
                }}
            />
        </div>
    );
} 