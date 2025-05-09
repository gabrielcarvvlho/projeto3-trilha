from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from typing import Optional
from ..models import Like, LikeCreate, LikeType, Post, PostWithLikes
from ..db import get_session
from sqlalchemy import func

router = APIRouter(prefix="/likes")

@router.post("/{post_id}")
def toggle_like(
    post_id: int,
    like_data: LikeCreate,
    user_id: int,  # Você pode pegar isso do token de autenticação
    session: Session = Depends(get_session)
):
    # Verifica se o post existe
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado")

    # Busca se já existe um like deste usuário neste post
    existing_like = session.exec(
        select(Like).where(
            Like.user_id == user_id,
            Like.post_id == post_id
        )
    ).first()

    if existing_like:
        if existing_like.type == like_data.type:
            # Se o usuário está dando o mesmo tipo de like, remove
            session.delete(existing_like)
            session.commit()
            return {"message": "Like removido"}
        else:
            # Se está mudando o tipo (de like para dislike ou vice-versa)
            existing_like.type = like_data.type
            session.add(existing_like)
            session.commit()
            return {"message": f"Alterado para {like_data.type}"}
    else:
        # Se não existe like, cria um novo
        new_like = Like(
            user_id=user_id,
            post_id=post_id,
            type=like_data.type
        )
        session.add(new_like)
        session.commit()
        return {"message": f"{like_data.type} adicionado"}

@router.get("/post/{post_id}")
def get_post_with_likes(
    post_id: int,
    user_id: Optional[int] = None,  # Opcional, para ver o like do usuário atual
    session: Session = Depends(get_session)
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado")

    # Conta likes e dislikes
    likes_count = session.exec(
        select(func.count(Like.id)).where(
            Like.post_id == post_id,
            Like.type == LikeType.LIKE
        )
    ).first()

    dislikes_count = session.exec(
        select(func.count(Like.id)).where(
            Like.post_id == post_id,
            Like.type == LikeType.DISLIKE
        )
    ).first()

    # Se user_id foi fornecido, busca o tipo de like do usuário
    user_like_type = None
    if user_id:
        user_like = session.exec(
            select(Like).where(
                Like.post_id == post_id,
                Like.user_id == user_id
            )
        ).first()
        if user_like:
            user_like_type = user_like.type

    return PostWithLikes(
        id=post.id,
        content=post.content,
        user_id=post.user_id,
        likes_count=likes_count,
        dislikes_count=dislikes_count,
        user_like_type=user_like_type
    )