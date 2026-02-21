from fastapi import APIRouter, Depends
from typing import List
from database import get_db_connection
from repositories.expertise_repository import ExpertiseRepository
from repositories.ator_repository import AtorRepository
from services.expertise_service import ExpertiseService
from schemas.expertise_schema import ExpertiseCreate, ExpertiseResponse

router = APIRouter(prefix="/api/expertises", tags=["Expertises Acadêmicas"])

def get_expertise_service(conn = Depends(get_db_connection)):
    expertise_repo = ExpertiseRepository(conn)
    ator_repo = AtorRepository(conn)
    return ExpertiseService(expertise_repo, ator_repo)

@router.post("/", response_model=ExpertiseResponse, status_code=201)
async def criar_expertise(expertise: ExpertiseCreate, service: ExpertiseService = Depends(get_expertise_service)):
    return service.criar_expertise(expertise)

@router.get("/", response_model=List[ExpertiseResponse])
async def listar_expertises(service: ExpertiseService = Depends(get_expertise_service)):
    return service.listar_expertises()

@router.delete("/{expertise_id}", response_model=ExpertiseResponse)
async def deletar_expertise(expertise_id: int, service: ExpertiseService = Depends(get_expertise_service)):
    return service.deletar_expertise(expertise_id)