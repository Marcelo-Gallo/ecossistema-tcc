from fastapi import APIRouter, Depends
from typing import List

from database import get_db_connection
from schemas.transparencia_schema import ProjetoConcluidoResponse, AporteTransparenciaResponse, TransparenciaKPIsResponse
from repositories.transparencia_repository import TransparenciaRepository
from services.transparencia_service import TransparenciaService

router = APIRouter(prefix="/api/transparencia", tags=["Transparência"])

def get_transparencia_service(conn = Depends(get_db_connection)):
    repo = TransparenciaRepository(conn)
    return TransparenciaService(repo)

@router.get("/projetos-concluidos", response_model=List[ProjetoConcluidoResponse])
async def listar_projetos_concluidos(service: TransparenciaService = Depends(get_transparencia_service)):
    return service.obter_painel_projetos()

@router.get("/aportes", response_model=List[AporteTransparenciaResponse])
async def listar_ultimos_aportes(service: TransparenciaService = Depends(get_transparencia_service)):
    return service.obter_ultimos_aportes()

@router.get("/kpis", response_model=TransparenciaKPIsResponse)
async def obter_metricas_kpi(service: TransparenciaService = Depends(get_transparencia_service)):
    return service.obter_kpis_governanca()