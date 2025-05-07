"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<
    { image: string | null; comment: string; likes: number; dislikes: number }[]
  >([]);
  const [image, setImage] = useState<File | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/"); // Se não estiver logado, volta pro login
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.replace("/");
  };

  const handlePost = () => {
    if (!image && !comment) {
      alert("Por favor, adicione uma imagem ou um comentário.");
      return;
    }

    const reader = new FileReader();
    if (image) {
      reader.onload = () => {
        const newPost = {
          image: reader.result as string,
          comment,
          likes: 0,
          dislikes: 0,
        };
        setPosts([newPost, ...posts]); // Adiciona o novo post ao início do feed
        setImage(null); // Limpa o campo de imagem
        setComment(""); // Limpa o campo de comentário
      };
      reader.readAsDataURL(image);
    } else {
      const newPost = {
        image: null,
        comment,
        likes: 0,
        dislikes: 0,
      };
      setPosts([newPost, ...posts]); // Adiciona o novo post ao início do feed
      setComment(""); // Limpa o campo de comentário
    }
  };

  const handleLike = (index: number) => {
    const updatedPosts = [...posts];
    updatedPosts[index].likes += 1;
    setPosts(updatedPosts);
  };

  const handleDislike = (index: number) => {
    const updatedPosts = [...posts];
    updatedPosts[index].dislikes += 1;
    setPosts(updatedPosts);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white p-6">
      {/* Botão de logout no canto superior direito */}
      <div className="w-full flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Sair
        </button>
      </div>

      {/* Formulário para adicionar foto e comentário */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Adicionar Foto ou Comentário</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="w-full mb-4"
        />
        <textarea
          placeholder="Adicione um comentário..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-400 dark:border-gray-600 rounded-lg"
        />
        <button
          onClick={handlePost}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Postar
        </button>
      </div>

      {/* Feed de posts */}
      <div className="w-full max-w-md">
        {posts.length === 0 ? (
          <p className="text-center">Nenhum post ainda. Adicione uma foto ou comentário!</p>
        ) : (
          posts.map((post, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-auto rounded-lg mb-4"
                />
              )}
              {post.comment && <p>{post.comment}</p>}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => handleLike(index)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Like ({post.likes})
                </button>
                <button
                  onClick={() => handleDislike(index)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Dislike ({post.dislikes})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
