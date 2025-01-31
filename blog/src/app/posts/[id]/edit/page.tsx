"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
    const router = useRouter();
    // 클라이언트 컴포넌트에서는 useParams() 사용
    const { id: postId } = useParams();

    const [loading, setLoading] = useState(false);

    // State
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // 1) 기존 게시글 불러오기
    useEffect(() => {
        const fetchPost = async () => {
            const { data: post, error } = await supabase
                .from("posts")
                .select("*")
                .eq("id", postId)
                .single();

            if (error) {
                console.error("Error fetching post:", error);
                alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
                router.push(`/posts/${postId}`);
                return;
            }
            if (!post) {
                alert("존재하지 않는 게시글입니다.");
                router.push("/");
                return;
            }

            setTitle(post.title);
            setAuthor(post.author); // DB에도 autor가 맞는지 확인
            setContent(post.content || "");
            setThumbnailUrl(post.thumbnail_url || null);
        };

        fetchPost();
    }, [postId, router]);

    // 2) 수정 처리
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let newThumbnailUrl = thumbnailUrl;

            // (선택) 새 이미지 업로드 시
            if (imageFile) {
                const fileName = `${Date.now()}_${imageFile.name}`;
                // 구조분해할 때 error -> uploadError 로 이름 맞추기
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("post-thumbnails") // 버킷 이름 정확히 일치
                    .upload(fileName, imageFile);

                if (uploadError) {
                    throw uploadError; // 에러 객체를 던지면 catch로 감
                }

                const {
                    data: { publicUrl },
                } = supabase.storage.from("post-thumbnails").getPublicUrl(fileName);

                newThumbnailUrl = publicUrl;
            }

            // 3) DB update
            const { error: updateError } = await supabase
                .from("posts")
                .update({
                    title,
                    author, // DB가 autor 라면 여기서도 autor
                    content,
                    thumbnail_url: newThumbnailUrl,
                })
                .eq("id", postId);

            if (updateError) {
                throw updateError;
            }

            alert("게시글이 수정되었습니다!");
            router.push(`/posts/${postId}`);
        } catch (err: any) {
            console.error("Update error:", err);
            alert(`수정 중 에러가 발생했습니다: ${err.message || err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-screen-md mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">게시글 수정</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 제목 */}
                <div>
                    <label className="block mb-1 font-medium">제목</label>
                    <input
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* 작성자 (author) */}
                <div>
                    <label className="block mb-1 font-medium">작성자</label>
                    <input
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </div>

                {/* 내용 */}
                <div>
                    <label className="block mb-1 font-medium">내용</label>
                    <textarea
                        className="w-full border rounded px-2 py-1 h-32"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {/* 기존 썸네일 미리보기 */}
                {thumbnailUrl && (
                    <div className="mb-2">
                        <p className="text-sm text-gray-500">현재 썸네일:</p>
                        <img src={thumbnailUrl} alt="thumbnail" className="w-32 h-auto" />
                    </div>
                )}

                {/* 새 이미지 업로드 */}
                <div>
                    <label className="block mb-1 font-medium">새 썸네일 이미지 (선택)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setImageFile(e.target.files[0]);
                            }
                        }}
                    />
                </div>

                {/* 버튼 */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {loading ? "수정 중..." : "수정하기"}
                    </button>
                </div>
            </form>
        </main>
    );
}
