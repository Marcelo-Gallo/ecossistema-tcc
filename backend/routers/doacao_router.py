from fastapi import APIRouter, Depends

from database import get_db_connection
from schemas.doacao_schema import DoacaoRequest, DoacaoResponse
from repositories.doacao_repository import DoacaoRepository
from services.doacao_service import DoacaoService

router = APIRouter(prefix="/api/doacoes", tags=["Doações e Aportes"])

def get_doacao_service(conn = Depends(get_db_connection)):
    repo = DoacaoRepository(conn)
    return DoacaoService(repo)

@router.post("/", response_model=DoacaoResponse, status_code=201)
async def realizar_doacao(request: DoacaoRequest, service: DoacaoService = Depends(get_doacao_service)):
    return await service.processar_doacao(request.doador_id, request.valor)