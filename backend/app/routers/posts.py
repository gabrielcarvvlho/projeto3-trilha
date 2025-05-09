from fastapi import APIRouter, HTTPException, Depends, Body, Query
from sqlmodel import Session, select
from typing import List, Optional
from ..models import Post, PostWithLikes, PostCreate, Like, LikeType
from ..db import get_session
import enum
router = APIRouter(prefix="/posts")

# Criar post
@router.post("/", response_model=Post)
def create_post(post: PostCreate, session: Session = Depends(get_session)):
    new_post = Post(content=post.content, user_id=post.user_id)
    session.add(new_post)
    session.commit()
    session.refresh(new_post)
    return new_post

# Listar todos os posts
@router.get("/", response_model=List[Post])
def list_posts(session: Session = Depends(get_session)):
    posts = session.exec(select(Post)).all()
    return posts

# Listar posts de um usuário
@router.get("/user/{user_id}", response_model=List[Post])
def list_user_posts(user_id: int, session: Session = Depends(get_session)):
    posts = session.exec(select(Post).where(Post.user_id == user_id)).all()
    return posts

# FEED: Listar posts com contagem de likes/dislikes
@router.get("/feed", response_model=List[PostWithLikes])
def list_posts_with_likes(
    session: Session = Depends(get_session),
    user_id: Optional[int] = Query(None, description="ID do usuário logado (opcional)")
):
    posts = session.exec(select(Post)).all()
    result = []

    for post in posts:
        # Corrigindo a contagem de likes
        likes = session.exec(
            select(Like).where(
                Like.post_id == post.id,
                Like.type == LikeType.LIKE
            )
        ).all()
        likes_count = len(likes)

        # Corrigindo a contagem de dislikes
        dislikes = session.exec(
            select(Like).where(
                Like.post_id == post.id,
                Like.type == LikeType.DISLIKE
            )
        ).all()
        dislikes_count = len(dislikes)

        # Verificando se o usuário atual deu like/dislike
        user_like_type = None
        if user_id:
            user_like = session.exec(
                select(Like).where(
                    Like.post_id == post.id,
                    Like.user_id == user_id
                )
            ).first()
            if user_like:
                user_like_type = user_like.type

        # Criando o objeto PostWithLikes
        result.append(PostWithLikes(
            id=post.id,
            content=post.content,
            user_id=post.user_id,
            likes_count=likes_count,
            dislikes_count=dislikes_count,
            user_like_type=user_like_type
        ))

    return result

# Buscar post por ID
@router.get("/{post_id}", response_model=Post)
def get_post(post_id: int, session: Session = Depends(get_session)):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")
    return post

# Atualizar post
@router.put("/{post_id}", response_model=Post)
def update_post(
    post_id: int,
    post_data: PostCreate,
    user_id: int = Body(..., embed=True),
    session: Session = Depends(get_session)
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")
    if post.user_id != user_id:
        raise HTTPException(status_code=403, detail="Você só pode editar seus próprios posts.")
    post.content = post_data.content
    # Atualize outros campos se quiser
    session.commit()
    session.refresh(post)
    return post

# Deletar post
@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    user_id: int = Query(..., description="ID do usuário que está tentando deletar"),
    session: Session = Depends(get_session)
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")
    if post.user_id != user_id:
        raise HTTPException(status_code=403, detail="Você só pode deletar seus próprios posts.")
    session.delete(post)
    session.commit()
    return {"message": "Post deletado com sucesso."}