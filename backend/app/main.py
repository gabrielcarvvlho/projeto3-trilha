from fastapi import FastAPI  
from .models import SQLModel   
from .db import engine  
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .routers import users, posts
from fastapi.staticfiles import StaticFiles

'''
SQLModel é importado do arquivo models.py
engine é importado do arquivo db.py, vai servir para conectar o banco de dados
users, posts e interactions são os rotas que foram definidos nos arquivos users.py, posts.py e interactions.py (os 3 arquivos estão na pasta routers)
'''
# esse ponto antes do import é para indicar que o arquivo está na mesma pasta que o main.py

app = FastAPI() 

@app.on_event("startup")  
def on_startup():  
    SQLModel.metadata.create_all(engine)
'''
essa parte vai criar as tabelas do banco de dados, todos eles definidos no arquivo 'models.py
'''

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
'''
facilidade o frontend com caminhos
'''


app.include_router(users.router)
app.include_router(posts.router)
<<<<<<< HEAD

=======


app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads") # adição da opção de carregar imagens
'''
essa parte vai incluir os routers que foram definidos nos arquivos 'users.py', 'posts.py' e 'interactions.py'
'''

'''
esse aquivo vai iniciar o FastAPI e garantir que o bd esteja pronto.
vai basicamente ligar as partes do projeto.
'''
