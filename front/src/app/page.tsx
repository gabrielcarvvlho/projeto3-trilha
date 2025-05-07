"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Post {
  id: number;
  content: string;
  user_id: number;
  image_url?: string;
  likes: number;
  dislikes: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/feed`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const handleCreatePost = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newPost }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts((prevPosts) => [data, ...prevPosts]);
        setNewPost("");
      })
      .catch((error) => console.error("Error creating post:", error));
  };

  const handleLike = (postId: number) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`, {
      method: "POST",
    })
      .then(() => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
      })
      .catch((error) => console.error("Error liking post:", error));
  };

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
      <header className="bg-gray-300 dark:bg-gray-700 shadow-md p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Trilhagram</h1>
      </header>

      <main className="p-4 sm:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <textarea
              className="w-full p-2 border border-gray-400 dark:border-gray-600 rounded-lg"
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <button
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleCreatePost}
            >
              Post
            </button>
          </div>

          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-4">
                <Image
                  src="/default-avatar.png"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h2 className="font-bold">User {post.user_id}</h2>
                </div>
              </div>
              <p className="mt-4">{post.content}</p>
              {post.image_url && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${post.image_url}`}
                  alt="Post Image"
                  width={500}
                  height={300}
                  className="rounded-lg mt-4"
                />
              )}
              <div className="mt-4 flex gap-4">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleLike(post.id)}
                >
                  Like ({post.likes})
                </button>
                <button className="text-red-600 hover:underline">
                  Dislike ({post.dislikes})
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
