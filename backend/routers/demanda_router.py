from fastapi import APIRouter, Depends
from typing import List
from database import get_db_connection
from repositories.demanda_repository import DemandaRepository
from repositories.ator_repository import AtorRepository
from services.demanda_service import DemandaService
from schemas.demanda_schema import DemandaCreate, DemandaResponse

router = APIRouter(prefix="/api/demandas", tags=["Demandas Prospectadas"])

def get_demanda_service(conn = Depends(get_db_connection)):
    demanda_repo = DemandaRepository(conn)
    ator_repo = AtorRepository(conn)
    return DemandaService(demanda_repo, ator_repo)

@router.post("/", response_model=DemandaResponse, status_code=201)
async def criar_demanda(demanda: DemandaCreate, service: DemandaService = Depends(get_demanda_service)):
    return service.criar_demanda(demanda)

@router.get("/", response_model=List[DemandaResponse])
async def listar_demandas(service: DemandaService = Depends(get_demanda_service)):
    return service.listar_demandas()

@router.delete("/{demanda_id}", response_model=DemandaResponse)
async def deletar_demanda(demanda_id: int, service: DemandaService = Depends(get_demanda_service)):
    return service.deletar_demanda(demanda_id)