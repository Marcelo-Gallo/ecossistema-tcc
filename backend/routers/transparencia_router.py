from fastapi import APIRouter, Depends
from typing import List

from database import get_db_connection
from schemas.transparencia_schema import ProjetoConcluidoResponse
from repositories.transparencia_repository import TransparenciaRepository
from services.transparencia_service import TransparenciaService

router = APIRouter(prefix="/api/transparencia", tags=["Transparência"])

def get_transparencia_service(conn = Depends(get_db_connection)):
    repo = TransparenciaRepository(conn)
    return TransparenciaService(repo)

@router.get("/projetos-concluidos", response_model=List[ProjetoConcluidoResponse])
async def listar_projetos_concluidos(service: TransparenciaService = Depends(get_transparencia_service)):
    return service.obter_painel_projetos()
