from fastapi import APIRouter, Depends
from typing import List
from database import get_db_connection
from repositories.pagamento_repository import PagamentoRepository
from repositories.membro_repository import MembroRepository
from services.pagamento_service import PagamentoService
from schemas.pagamento_schema import PagamentoCreate, PagamentoResponse

router = APIRouter(prefix="/api/pagamentos", tags=["Auditoria e Pagamento de Bolsas"])

def get_pagamento_service(conn = Depends(get_db_connection)):
    pagamento_repo = PagamentoRepository(conn)
    membro_repo = MembroRepository(conn)
    return PagamentoService(pagamento_repo, membro_repo)

@router.post("/", response_model=PagamentoResponse, status_code=201)
async def criar_pagamento(pagamento: PagamentoCreate, service: PagamentoService = Depends(get_pagamento_service)):
    return service.criar_pagamento(pagamento)

@router.get("/", response_model=List[PagamentoResponse])
async def listar_pagamentos(service: PagamentoService = Depends(get_pagamento_service)):
    return service.listar_pagamentos()

@router.delete("/{pagamento_id}", response_model=PagamentoResponse)
async def deletar_pagamento(pagamento_id: int, service: PagamentoService = Depends(get_pagamento_service)):
    return service.deletar_pagamento(pagamento_id)