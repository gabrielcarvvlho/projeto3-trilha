"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPosts, createPost, handleReaction } from "../../services/api";

type Post = {
  id: number;
  content: string;
  user_id: number;
  likes: number;
  dislikes: number;
};

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{id: number} | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
      router.replace("/");
    } else {
      setCurrentUser(JSON.parse(userData));
      loadPosts();
    }
  }, [router]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async () => {
    if (!content.trim() || !currentUser) return;
    
    try {
      await createPost(content, currentUser.id);
      setContent("");
      await loadPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleReaction = async (postId: number, type: 'like' | 'dislike') => {
    if (!currentUser) return;

    try {
      await handleReaction(postId, currentUser.id, type); 
      await loadPosts();
    } catch (error) {
      console.error("Error reacting to post:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.replace("/");
  };

  if (loading) {
    return <div className="text-center p-4">Carregando posts...</div>;
  }

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feed</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </header>

      <div className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="O que você está pensando?"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleSubmitPost}
          disabled={!content.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Postar
        </button>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center">Nenhum post ainda. Seja o primeiro!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-4 border rounded shadow">
              <p className="mb-2">{post.content}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleReaction(post.id, 'like')}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded"
                >
                  👍 {post.likes}
                </button>
                <button
                  onClick={() => handleReaction(post.id, 'dislike')}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded"
                >
                  👎 {post.dislikes}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}