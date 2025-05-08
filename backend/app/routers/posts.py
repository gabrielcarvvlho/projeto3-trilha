from fastapi import APIRouter, HTTPException, Depends, Body, Query
from sqlmodel import Session, select
from ..models import Post, PostCreate
from ..db import get_session

router = APIRouter(prefix="/posts")

@router.post("/")
def create_post(post: PostCreate, session: Session = Depends(get_session)):
    new_post = Post(content=post.content, user_id=post.user_id)
    session.add(new_post)
    session.commit()
    session.refresh(new_post)
    return new_post

@router.get("/")
def list_posts(session: Session = Depends(get_session)):
    posts = session.exec(select(Post)).all()
    return posts

@router.get("/user/{user_id}")
def list_user_posts(user_id: int, session: Session = Depends(get_session)):
    posts = session.exec(select(Post).where(Post.user_id == user_id)).all()
    return posts

@router.get("/{post_id}")
def get_post(post_id: int, session: Session = Depends(get_session)):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")
    return post

@router.put("/{post_id}")
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
    session.commit()
    session.refresh(post)
    return post

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