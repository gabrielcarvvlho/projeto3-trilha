"use client";

import { useEffect, useState } from "react";
import { fetchPosts, createPost } from "../../services/api"; // Certifique-se de que o serviço `createPost` está implementado

export default function HomePage() {
  interface Post {
    id: number;
    title: string;
    content: string;
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState(""); // Estado para o título do novo post
  const [newPostContent, setNewPostContent] = useState(""); // Estado para o conteúdo do novo post
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        console.error("Erro ao carregar posts:", err);
        setError("Erro ao carregar os posts.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostTitle || !newPostContent) {
      alert("Preencha o título e o conteúdo do post.");
      return;
    }

    try {
      const newPost = await createPost({ title: newPostTitle, content: newPostContent });
      setPosts([newPost, ...posts]); // Adiciona o novo post ao início do feed
      setNewPostTitle(""); // Limpa o campo de título
      setNewPostContent(""); // Limpa o campo de conteúdo
    } catch (err) {
      console.error("Erro ao criar post:", err);
      setError("Erro ao criar o post.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
        <p>Carregando feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Feed de Posts</h1>

      {/* Formulário para criar novo post */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Criar Novo Post</h2>
        <input
          type="text"
          placeholder="Título do post"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-400 dark:border-gray-600 rounded-lg"
        />
        <textarea
          placeholder="Conteúdo do post"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-400 dark:border-gray-600 rounded-lg"
        />
        <button
          onClick={handleCreatePost}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Postar
        </button>
      </div>

      {/* Lista de posts */}
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <p>Nenhum post encontrado.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p>{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

