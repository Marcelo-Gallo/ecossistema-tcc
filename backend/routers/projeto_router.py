from fastapi import APIRouter, Depends
from typing import List
from pydantic import BaseModel
from database import get_db_connection
from repositories.projeto_repository import ProjetoRepository
from repositories.demanda_repository import DemandaRepository
from repositories.expertise_repository import ExpertiseRepository
from repositories.edital_repository import EditalRepository
from services.projeto_service import ProjetoService
from schemas.projeto_schema import ProjetoCreate, ProjetoResponse

router = APIRouter(prefix="/api/projetos", tags=["Projetos de Inovação (Tríplice Hélice)"])

class StatusUpdate(BaseModel):
    status: str

def get_projeto_service(conn = Depends(get_db_connection)):
    projeto_repo = ProjetoRepository(conn)
    demanda_repo = DemandaRepository(conn)
    expertise_repo = ExpertiseRepository(conn)
    edital_repo = EditalRepository(conn)
    return ProjetoService(projeto_repo, demanda_repo, expertise_repo, edital_repo)

@router.post("/", response_model=ProjetoResponse, status_code=201)
async def criar_projeto(projeto: ProjetoCreate, service: ProjetoService = Depends(get_projeto_service)):
    return service.criar_projeto(projeto)

@router.get("/", response_model=List[ProjetoResponse])
async def listar_projetos(service: ProjetoService = Depends(get_projeto_service)):
    return service.listar_projetos()

@router.put("/{projeto_id}/status")
async def atualizar_status_projeto(projeto_id: int, payload: StatusUpdate, service: ProjetoService = Depends(get_projeto_service)):
    return service.alterar_status_projeto(projeto_id, payload.status)

@router.delete("/{projeto_id}", response_model=ProjetoResponse)
async def deletar_projeto(projeto_id: int, service: ProjetoService = Depends(get_projeto_service)):
    return service.deletar_projeto(projeto_id)