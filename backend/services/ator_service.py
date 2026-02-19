from fastapi import HTTPException
from repositories.ator_repository import AtorRepository
from schemas.ator_schema import AtorCreate

class AtorService:
    def __init__(self, repository: AtorRepository):
        self.repository = repository

    def criar_ator(self, ator_data: AtorCreate):
        return self.repository.create(ator_data)

    def listar_atores(self):
        return self.repository.get_all_active()

    def deletar_ator(self, ator_id: int):
        ator = self.repository.get_by_id(ator_id)
        if not ator:
            raise HTTPException(status_code=404, detail="Ator não encontrado ou já eliminado.")
        return self.repository.soft_delete(ator_id)