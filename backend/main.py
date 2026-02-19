from fastapi import FastAPI

from routers import ator_router
from routers import demanda_router

app = FastAPI(
    title="Portal da Governança - Fundo Patrimonial",
    description="API para o ecossistema de inovação da Tríplice Hélice",
    version="1.0.0"
)

app.include_router(ator_router.router)
app.include_router(demanda_router.router)

@app.get("/")
def read_root():
    return {"status": "API do Portal da Governança operacional!"}