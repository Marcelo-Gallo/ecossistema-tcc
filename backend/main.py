from fastapi import FastAPI

# Importar o router que criámos na pasta routers
from routers import ator_router

# Criar a instância principal da aplicação FastAPI
app = FastAPI(
    title="Portal da Governança - Fundo Patrimonial",
    description="API para o ecossistema de inovação da Tríplice Hélice",
    version="1.0.0"
)

app.include_router(ator_router.router)

@app.get("/")
def read_root():
    return {"status": "API do Portal da Governança operacional!"}