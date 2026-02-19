from fastapi import APIRouter, Depends
from typing import List
from database import get_db_connection
from repositories.ator_repository import AtorRepository
from services.ator_service import AtorService
from schemas.ator_schema import AtorCreate, AtorResponse

router = APIRouter(prefix="/api/atores", tags=["Atores da Tríplice Hélice"])

def get_ator_service(conn = Depends(get_db_connection)):
    repo = AtorRepository(conn)
    return AtorService(repo)

@router.post("/", response_model=AtorResponse, status_code=201)
async def criar_ator(ator: AtorCreate, service: AtorService = Depends(get_ator_service)):
    return service.criar_ator(ator)

@router.get("/", response_model=List[AtorResponse])
async def listar_atores(service: AtorService = Depends(get_ator_service)):
    return service.listar_atores()

@router.delete("/{ator_id}", response_model=AtorResponse)
async def deletar_ator(ator_id: int, service: AtorService = Depends(get_ator_service)):
    return service.deletar_ator(ator_id)