"use client";

import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function NewPostPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState(null);

    useEffect(() => {
        // 현재 세션 정보 가져오기
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                // 로그인 안됨
                alert('로그인이 필요합니다.');
                router.push('/auth/signin');
            } else {
                setSession(session);
            }
        });
    }, [router]);

    if (!session) {
        return <p>로그인 확인 중...</p>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !author) {
            alert('제목과 작성자는 필수입니다.');
            return;
        }

        setLoading(true);

        try {
            let thumbnailUrl = null;

            // 1) 이미지 파일이 있다면 Supabase Storage에 업로드
            if (imageFile) {
                // 고유 파일 이름 생성(예: Date.now() + original name)
                const fileName = `${Date.now()}_${imageFile.name}`;
                // 업로드 코드
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('post-thumbnails')
                    .upload(fileName, imageFile);


                if (uploadError) {
                    throw uploadError;
                }

                // 2) public URL 가져오기
                //    (버킷 설정이 public이어야 아래 publicURL이 정상 동작)
                const {
                    data: { publicUrl },
                } = supabase.storage.from('post-thumbnails').getPublicUrl(fileName);

                thumbnailUrl = publicUrl;
            }

            // 3) DB에 새 게시글 insert
            const { error: insertError } = await supabase.from('posts').insert([
                {
                    title,
                    author,
                    content,
                    thumbnail_url: thumbnailUrl,
                },
            ]);

            if (insertError) {
                throw insertError;
            }

            // 업로드 & DB 저장 완료 시 메인 페이지로 이동
            alert('새 글이 작성되었습니다!');
            router.push('/');
        } catch (err) {
            console.error('글 작성 에러:', err);
            alert('글 작성 중 에러가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-screen-lg mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">새 글 작성</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 제목 */}
                <div>
                    <label className="block mb-1 font-medium">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                        required
                    />
                </div>

                {/* 작성자 */}
                <div>
                    <label className="block mb-1 font-medium">작성자</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                        required
                    />
                </div>

                {/* 내용 */}
                <div>
                    <label className="block mb-1 font-medium">내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border rounded px-2 py-1 h-32"
                    />
                </div>

                {/* 등록 버튼 */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        {loading ? '등록 중...' : '등록'}
                    </button>
                </div>
            </form>
        </main>
    );
}
