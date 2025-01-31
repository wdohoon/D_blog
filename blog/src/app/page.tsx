// src/app/page.tsx
import { supabase } from '@/lib/supabaseClient';
import React from 'react';

export default async function HomePage() {
  // Supabase에서 posts 불러오기 (최신 날짜 기준 정렬 예시)
  const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error.message);
    return (
        <main className="max-w-screen-lg mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">에러가 발생했습니다.</h1>
          <p className="text-red-600">{error.message}</p>
        </main>
    );
  }

  return (
      <main className="max-w-screen-lg mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">게시글 목록</h1>
        <div className="space-y-4">
          {posts && posts.length > 0 ? (
              posts.map((post) => (
                  <div
                      key={post.id}
                      className="bg-white dark:bg-gray-800 rounded-md shadow p-4"
                  >
                    <div className="flex gap-4">
                      {/* 썸네일이 있다면 표시 */}
                      {post.thumbnail_url && (
                          <img
                              src={post.thumbnail_url}
                              alt="thumbnail"
                              className="w-32 h-32 object-cover rounded"
                          />
                      )}
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold">{post.title}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          작성자: {post.author} | 날짜: {post.date}
                        </p>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">
                          {post.content}
                        </p>
                      </div>
                    </div>
                  </div>
              ))
          ) : (
              <p className="text-gray-600">게시글이 없습니다.</p>
          )}
        </div>

        {/* 새 글 작성 페이지로 이동 버튼 */}
        <div className="mt-8">
          <a
              href="/posts/new"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            새 글 작성하기
          </a>
        </div>
      </main>
  );
}
