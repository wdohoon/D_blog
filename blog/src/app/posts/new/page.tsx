"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {Session} from "@supabase/auth-js";

export default function NewPostPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                alert('로그인이 필요합니다. 🔒');
                router.push('/auth/signin');
            } else {
                setSession(session);
            }
        });
    }, [router]);

    if (!session) {
        return <p className="text-center mt-10">로그인 확인 중... ⏳</p>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !author) {
            alert('제목과 작성자는 필수입니다. 📝');
            return;
        }

        setLoading(true);

        try {
            let thumbnailUrl = null;

            if (imageFile) {
                const fileName = `${Date.now()}_${imageFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('post-thumbnails')
                    .upload(fileName, imageFile);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('post-thumbnails')
                    .getPublicUrl(fileName);

                thumbnailUrl = publicUrl;
            }

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

            alert('새 글이 작성되었습니다! 🎉');
            router.push('/');
        } catch (err) {
            console.error('글 작성 에러:', err);
            alert('글 작성 중 에러가 발생했습니다. 😞');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">새 글 작성 ✍️</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 font-medium">제목 📌</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">작성자 👤</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">내용 📝</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">썸네일 이미지 🖼️</label>
                    <input
                        type="file"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        accept="image/*"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300"
                >
                    {loading ? '등록 중... ⏳' : '등록하기 🚀'}
                </button>
            </form>
        </main>
    );
}
