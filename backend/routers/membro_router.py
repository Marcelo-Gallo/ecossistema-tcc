from fastapi import APIRouter, Depends
from typing import List
from database import get_db_connection
from repositories.membro_repository import MembroRepository
from repositories.projeto_repository import ProjetoRepository
from services.membro_service import MembroService
from schemas.membro_schema import MembroCreate, MembroResponse

router = APIRouter(prefix="/api/membros", tags=["Membros do Projeto"])

def get_membro_service(conn = Depends(get_db_connection)):
    membro_repo = MembroRepository(conn)
    projeto_repo = ProjetoRepository(conn)
    return MembroService(membro_repo, projeto_repo)

@router.post("/", response_model=MembroResponse, status_code=201)
async def criar_membro(membro: MembroCreate, service: MembroService = Depends(get_membro_service)):
    return service.criar_membro(membro)

@router.get("/", response_model=List[MembroResponse])
async def listar_membros(service: MembroService = Depends(get_membro_service)):
    return service.listar_membros()

@router.delete("/{membro_id}", response_model=MembroResponse)
async def deletar_membro(membro_id: int, service: MembroService = Depends(get_membro_service)):
    return service.deletar_membro(membro_id)