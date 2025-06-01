import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CodePicks",
    description: "QiitaとZennの最新記事をまとめて表示",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja" className="dark">
            <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors`}>
                {children}
            </body>
        </html>
    );
} 