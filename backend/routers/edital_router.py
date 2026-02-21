from fastapi import APIRouter, Depends
from typing import List
from database import get_db_connection
from repositories.edital_repository import EditalRepository
from services.edital_service import EditalService
from schemas.edital_schema import EditalCreate, EditalResponse

router = APIRouter(prefix="/api/editais", tags=["Editais de Fomento"])

def get_edital_service(conn = Depends(get_db_connection)):
    edital_repo = EditalRepository(conn)
    return EditalService(edital_repo)

@router.post("/", response_model=EditalResponse, status_code=201)
async def criar_edital(edital: EditalCreate, service: EditalService = Depends(get_edital_service)):
    return service.criar_edital(edital)

@router.get("/", response_model=List[EditalResponse])
async def listar_editais(service: EditalService = Depends(get_edital_service)):
    return service.listar_editais()

@router.delete("/{edital_id}", response_model=EditalResponse)
async def deletar_edital(edital_id: int, service: EditalService = Depends(get_edital_service)):
    return service.deletar_edital(edital_id)