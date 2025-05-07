from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from ..models import User, UserCreate, UserLogin
from ..db import get_session
import jwt  # Biblioteca para gerar tokens JWT (instale com `pip install pyjwt`)

SECRET_KEY = "your_secret_key"  # Substitua por uma chave secreta segura

router = APIRouter(prefix="/users")

@router.post("/register")
def register_user(user: UserCreate, session: Session = Depends(get_session)):
    # Verifica se já existe um usuário com esse username
    statement = select(User).where(User.username == user.username)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Nome de usuário já existe.")

    # Cria um novo usuário a partir do modelo UserCreate
    new_user = User(username=user.username, password=user.password)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

@router.post("/login")
def login(data: UserLogin, session: Session = Depends(get_session)):
    # Busca o usuário pelo username
    statement = select(User).where(User.username == data.username)
    user = session.exec(statement).first()
    if not user or user.password != data.password:
        raise HTTPException(status_code=401, detail="Nome de usuário ou senha incorretos.")

    # Gera um token JWT
    token = jwt.encode({"user_id": user.id, "username": user.username}, SECRET_KEY, algorithm="HS256")

    # Retorna o token e o username
    return {"token": token, "username": user.username}
