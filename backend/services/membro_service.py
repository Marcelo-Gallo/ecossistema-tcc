from fastapi import HTTPException
from repositories.membro_repository import MembroRepository
from repositories.projeto_repository import ProjetoRepository
from schemas.membro_schema import MembroCreate

class MembroService:
    def __init__(self, membro_repo: MembroRepository, projeto_repo: ProjetoRepository):
        self.membro_repo = membro_repo
        self.projeto_repo = projeto_repo

    def criar_membro(self, membro_data: MembroCreate):
        # Validação da Chave Estrangeira ==> O Projeto precisa existir
        projeto_existente = self.projeto_repo.get_by_id(membro_data.projeto_id)
        if not projeto_existente:
            raise HTTPException(
                status_code=400, 
                detail=f"Falha ao registar membro: O Projeto com ID {membro_data.projeto_id} não existe."
            )
        
        return self.membro_repo.create(membro_data)

    def listar_membros(self):
        return self.membro_repo.get_all_active()

    def deletar_membro(self, membro_id: int):
        membro = self.membro_repo.get_by_id(membro_id)
        if not membro:
            raise HTTPException(status_code=404, detail="Membro não encontrado.")
        return self.membro_repo.soft_delete(membro_id)