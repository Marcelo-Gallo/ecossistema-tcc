from fastapi import HTTPException
from repositories.demanda_repository import DemandaRepository
from repositories.ator_repository import AtorRepository
from schemas.demanda_schema import DemandaCreate

class DemandaService:
    def __init__(self, demanda_repo: DemandaRepository, ator_repo: AtorRepository):
        self.demanda_repo = demanda_repo
        self.ator_repo = ator_repo

    def criar_demanda(self, demanda_data: DemandaCreate):
        ator_existente = self.ator_repo.get_by_id(demanda_data.ator_id)
        if not ator_existente:
            raise HTTPException(
                status_code=400, 
                detail=f"Não foi possível criar a demanda: O Ator com ID {demanda_data.ator_id} não existe ou foi eliminado."
            )
        
        return self.demanda_repo.create(demanda_data)

    def listar_demandas(self):
        return self.demanda_repo.get_all_active()

    def deletar_demanda(self, demanda_id: int):
        demanda = self.demanda_repo.get_by_id(demanda_id)
        if not demanda:
            raise HTTPException(status_code=404, detail="Demanda não encontrada ou já eliminada.")
        return self.demanda_repo.soft_delete(demanda_id)