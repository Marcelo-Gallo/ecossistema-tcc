from fastapi import HTTPException
import psycopg2
from repositories.edital_repository import EditalRepository
from schemas.edital_schema import EditalCreate

class EditalService:
    def __init__(self, edital_repo: EditalRepository):
        self.edital_repo = edital_repo

    def criar_edital(self, edital_data: EditalCreate):
        # Cronologia das datas
        if edital_data.data_fechamento <= edital_data.data_abertura:
            raise HTTPException(
                status_code=400, 
                detail="A data de fechamento deve ser posterior à data de abertura."
            )
        
        try:
            return self.edital_repo.create(edital_data)
        except psycopg2.errors.UniqueViolation:
            # pega vioalação da constrain unique
            self.edital_repo.conn.rollback()
            raise HTTPException(
                status_code=400, 
                detail=f"Já existe um edital com o código '{edital_data.codigo_identificacao}'."
            )

    def listar_editais(self):
        return self.edital_repo.get_all_active()

    def deletar_edital(self, edital_id: int):
        edital = self.edital_repo.get_by_id(edital_id)
        if not edital:
            raise HTTPException(status_code=404, detail="Edital não encontrado.")
        return self.edital_repo.soft_delete(edital_id)