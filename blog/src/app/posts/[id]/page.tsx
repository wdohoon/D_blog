// src/app/posts/[id]/page.tsx
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import DeleteButton from "@/app/DeleteButton";

export default async function PostDetailPage({
                                                 params,
                                             }: {
    // params가 Promise 형태로 온다고 가정
    params: Promise<{ id: string }>;
}) {
    // 여기서 await
    const { id } = await params;

    // 이후 id 사용
    const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error('Error fetching post:', error.message);
        return (
            <main className="max-w-screen-md mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">게시글 조회 오류</h1>
                <p className="text-red-600">{error.message}</p>
            </main>
        );
    }

    if (!post) {
        return (
            <main className="max-w-screen-md mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">존재하지 않는 게시글</h1>
                <p className="text-gray-600">해당 게시글을 찾을 수 없습니다.</p>
            </main>
        );
    }

    return (
        <main className="max-w-screen-md mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-sm text-gray-500 mb-4">
                작성자: {post.author} | 날짜: {post.date}
            </p>

            {post.thumbnail_url && (
                <img
                    src={post.thumbnail_url}
                    alt="thumbnail"
                    className="w-full h-auto mb-4 object-cover rounded"
                />
            )}

            <div className="text-gray-700 whitespace-pre-line">
                {post.content}
            </div>

            {/* 하단에 수정 / 삭제 버튼 (로그인 여부나 작성자 여부에 따라 보여줄 수도 있음) */}
            <div className="mt-8 flex gap-4">
                <Link
                    href={`/posts/${id}/edit`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    수정
                </Link>
                <DeleteButton postId={id} />
            </div>
        </main>
    );
}
