// src/app/layout.tsx
import React from 'react';
import '../styles/globals.css';
import { Metadata } from 'next';
import Providers from './theme-provider';
import ThemeSwitcher from './theme-switcher';
import SearchBar from './search-bar';
import AuthLinks from './auth-links';

export const metadata: Metadata = {
    title: 'MyBlog',
    description: 'Velog 스타일 블로그 + 검색 기능',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" suppressHydrationWarning>
        <body className="transition-colors duration-300 bg-white dark:bg-gray-900 text-black dark:text-white">
        <Providers>
            {/* 헤더 */}
            <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
                <nav className="max-w-screen-lg mx-auto px-4 h-16 flex items-center justify-between">
                    {/* 로고 */}
                    <div className="text-xl font-bold cursor-pointer">
                        <a href="/">MyBlog</a>
                    </div>

                    {/* 우측 메뉴 */}
                    <div className="flex items-center gap-4">
                        {/* 검색 바 */}
                        <SearchBar />

                        {/* 로그인/회원가입/로그아웃 토글 */}
                        <AuthLinks />

                        {/* 다크모드 스위치 */}
                        <ThemeSwitcher />
                    </div>
                </nav>
            </header>

            {/* 메인 컨텐츠 */}
            {children}

            {/* 푸터 */}
            <footer className="bg-white dark:bg-gray-800 border-t mt-8 transition-colors duration-300">
                <div className="max-w-screen-lg mx-auto px-4 h-16 flex items-center justify-center">
                    © 2025 MyBlog. All rights reserved.
                </div>
            </footer>
        </Providers>
        </body>
        </html>
    );
}
