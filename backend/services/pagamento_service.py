from fastapi import HTTPException
import psycopg2
from repositories.pagamento_repository import PagamentoRepository
from repositories.membro_repository import MembroRepository
from schemas.pagamento_schema import PagamentoCreate

class PagamentoService:
    def __init__(self, pagamento_repo: PagamentoRepository, membro_repo: MembroRepository):
        self.pagamento_repo = pagamento_repo
        self.membro_repo = membro_repo

    def criar_pagamento(self, pagamento_data: PagamentoCreate):
        # Validação: O Membro precisa existir
        if not self.membro_repo.get_by_id(pagamento_data.membro_id):
            raise HTTPException(
                status_code=400, 
                detail=f"Membro com ID {pagamento_data.membro_id} não encontrado."
            )
        
        try:
            return self.pagamento_repo.create(pagamento_data)
        except psycopg2.errors.UniqueViolation:
            self.pagamento_repo.conn.rollback()
            raise HTTPException(
                status_code=400, 
                detail=f"Já existe um pagamento com o código de transação '{pagamento_data.codigo_transacao}'."
            )

    def listar_pagamentos(self):
        return self.pagamento_repo.get_all_active()

    def deletar_pagamento(self, pagamento_id: int):
        pagamento = self.pagamento_repo.get_by_id(pagamento_id)
        if not pagamento:
            raise HTTPException(status_code=404, detail="Pagamento não encontrado.")
        return self.pagamento_repo.soft_delete(pagamento_id)