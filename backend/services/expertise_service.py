from fastapi import HTTPException
from repositories.expertise_repository import ExpertiseRepository
from repositories.ator_repository import AtorRepository
from schemas.expertise_schema import ExpertiseCreate

class ExpertiseService:
    def __init__(self, expertise_repo: ExpertiseRepository, ator_repo: AtorRepository):
        self.expertise_repo = expertise_repo
        self.ator_repo = ator_repo

    def criar_expertise(self, expertise_data: ExpertiseCreate):
        # O Ator deve existir e estar ativo
        ator_existente = self.ator_repo.get_by_id(expertise_data.ator_id)
        if not ator_existente:
            raise HTTPException(
                status_code=400, 
                detail=f"Não foi possível criar a expertise: O Ator com ID {expertise_data.ator_id} não existe."
            )
        
        # A Expertise deve vir da academia neste cenário
        if ator_existente['tipo_helice'] != 'UNIVERSIDADE':
            raise HTTPException(
                status_code=400,
                detail="Operação negada: Expertises só podem ser vinculadas a Atores da hélice UNIVERSIDADE."
            )

        return self.expertise_repo.create(expertise_data)

    def listar_expertises(self):
        return self.expertise_repo.get_all_active()

    def deletar_expertise(self, expertise_id: int):
        expertise = self.expertise_repo.get_by_id(expertise_id)
        if not expertise:
            raise HTTPException(status_code=404, detail="Expertise não encontrada ou já eliminada.")
        return self.expertise_repo.soft_delete(expertise_id)