import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

// 날짜를 YYYY-MM-DD HH:mm 형태로 포맷팅해주는 함수
function formatDateString(dateString: string) {
    const dateObj = new Date(dateString);

    // 혹시 dateString이 제대로 된 날짜가 아닐 경우 대비
    if (isNaN(dateObj.getTime())) {
        return dateString; // 그대로 문자열 표시 or "Invalid Date"
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    // 최종 형태: "YYYY-MM-DD HH:mm"
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export default async function HomePage() {
    const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("date", { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error.message);
        return (
            <main className="max-w-screen-lg mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">에러가 발생했습니다 😞</h1>
                <p className="text-red-600">{error.message}</p>
            </main>
        );
    }

    return (
        <main className="max-w-screen-lg mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">📚 블로그 포스트</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts && posts.length > 0 ? (
                    posts.map((post) => {
                        // 날짜 포맷 변환
                        const formattedDate = formatDateString(post.date);

                        return (
                            <div
                                key={post.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
                            >
                                <Link
                                    href={`/posts/${post.id}`}
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    {post.thumbnail_url ? (
                                        <img
                                            src={post.thumbnail_url || "/placeholder.svg"}
                                            alt="thumbnail"
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <span className="text-4xl">📷</span>
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                            ✍️ {post.author} | 🗓️ {formattedDate}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{post.content}</p>
                                    </div>
                                </Link>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center col-span-3">
                        게시글이 없습니다. 첫 글의 주인공이 되어보세요! ✨
                    </p>
                )}
            </div>

            <div className="mt-12 text-center">
                <Link
                    href="/posts/new"
                    className="inline-block bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition duration-300"
                >
                    ✍️ 새 글 작성하기
                </Link>
            </div>
        </main>
    );
}
