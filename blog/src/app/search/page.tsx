import { supabase } from "@/lib/supabaseClient";
import React from "react";
import Link from "next/link";

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 
          ${(date.getMonth() + 1).toString().padStart(2, '0')}월 
          ${date.getDate().toString().padStart(2, '0')}일 
          ${date.getHours().toString().padStart(2, '0')}시 
          ${date.getMinutes().toString().padStart(2, '0')}분`;
}

export default async function SearchPage({
                                             searchParams,
                                         }: {
    searchParams?: { query?: string };
}) {
    const query = searchParams?.query?.trim() || "";

    if (!query) {
        return (
            <div className="max-w-screen-lg mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-6 text-center">🔍 검색</h1>
                <p className="text-gray-600 dark:text-gray-400 text-center text-lg">검색어를 입력해주세요.</p>
            </div>
        );
    }

    const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .or(`title.ilike.%${query}%, author.ilike.%${query}%, content.ilike.%${query}%`)

    if (error) {
        console.error("검색 오류:", error.message);
        return (
            <div className="max-w-screen-lg mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-6 text-center">🔍 검색 결과</h1>
                <p className="text-red-500 text-center text-lg">검색 도중 오류가 발생했습니다. 😞</p>
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="max-w-screen-lg mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-6 text-center">🔍 검색 결과</h1>
                <p className="text-gray-600 dark:text-gray-400 text-center text-lg">"{query}"에 대한 검색 결과가 없습니다. 😅</p>
            </div>
        );
    }

    return (
        <div className="max-w-screen-lg mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6 text-center">🔍 "{query}"에 대한 검색 결과</h1>

            <div className="space-y-6">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg"
                    >
                        <Link href={`/posts/${post.id}`}>
                            <h2 className="text-2xl font-semibold mb-3 hover:text-blue-600 dark:hover:text-blue-400">{post.title}</h2>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.content}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
                            <span>✍️ {post.author}</span>
                            <span>🗓️ {formatDate(post.date)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
