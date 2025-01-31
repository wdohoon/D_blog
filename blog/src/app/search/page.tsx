// src/app/search/page.tsx
import { supabase } from "@/lib/supabaseClient";
import React from "react";

// 라우트 파라미터 대신, App Router에서는 searchParams로 쿼리스트링을 받음
// 예) /search?query=test
export default async function SearchPage({
                                             searchParams,
                                         }: {
    searchParams?: { query?: string };
}) {
    const query = searchParams?.query?.trim() || "";

    // 검색어가 없으면 빈 배열 리턴
    if (!query) {
        return (
            <div className="max-w-screen-lg mx-auto px-4 py-8">
                <h1 className="text-2xl font-semibold mb-4">검색 결과</h1>
                <p className="text-gray-500">검색어를 입력해주세요.</p>
            </div>
        );
    }

    // Supabase 검색
    // 예시: posts 테이블에 title, author, date 컬럼이 있다고 가정
    // - OR 조건으로 title, author, date 중 하나라도 ilike '%query%'
    // - 날짜(date)를 문자열(YYYY-MM-DD 등)로 저장했다는 가정
    // 실제 날짜타입이라면 범위 검색 로직이 필요할 수 있음
    const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        // .or() 문법: "title.ilike.%키워드%, author.ilike.%키워드%, date.ilike.%키워드%"
        .or(
            `title.ilike.%${query}%,author.ilike.%${query}%,date.ilike.%${query}%`
        );

    if (error) {
        console.error("검색 오류:", error.message);
        return (
            <div className="max-w-screen-lg mx-auto px-4 py-8">
                <h1 className="text-2xl font-semibold mb-4">검색 결과</h1>
                <p className="text-red-500">검색 도중 오류가 발생했습니다.</p>
            </div>
        );
    }

    // 검색 결과가 없는 경우
    if (!posts || posts.length === 0) {
        return (
            <div className="max-w-screen-lg mx-auto px-4 py-8">
                <h1 className="text-2xl font-semibold mb-4">검색 결과</h1>
                <p className="text-gray-500">일치하는 게시글이 없습니다.</p>
            </div>
        );
    }

    // 검색 결과가 있는 경우
    return (
        <div className="max-w-screen-lg mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">검색 결과</h1>

            <div className="space-y-4">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 transition-colors duration-300"
                    >
                        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">{post.content}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                            <span>작성자: {post.author}</span>
                            <span>날짜: {post.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
