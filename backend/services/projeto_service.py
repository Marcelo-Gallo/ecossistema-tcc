from fastapi import HTTPException
from repositories.projeto_repository import ProjetoRepository
from repositories.demanda_repository import DemandaRepository
from repositories.expertise_repository import ExpertiseRepository
from repositories.edital_repository import EditalRepository
from schemas.projeto_schema import ProjetoCreate

class ProjetoService:
    def __init__(self, projeto_repo: ProjetoRepository, demanda_repo: DemandaRepository, 
                 expertise_repo: ExpertiseRepository, edital_repo: EditalRepository):
        self.projeto_repo = projeto_repo
        self.demanda_repo = demanda_repo
        self.expertise_repo = expertise_repo
        self.edital_repo = edital_repo

    def criar_projeto(self, projeto_data: ProjetoCreate):
        # Valida Demanda
        if not self.demanda_repo.get_by_id(projeto_data.demanda_id):
            raise HTTPException(status_code=400, detail=f"A Demanda com ID {projeto_data.demanda_id} não existe.")
        
        # Valida Expertise
        if not self.expertise_repo.get_by_id(projeto_data.expertise_id):
            raise HTTPException(status_code=400, detail=f"A Expertise com ID {projeto_data.expertise_id} não existe.")

        # Valida Edital
        if not self.edital_repo.get_by_id(projeto_data.edital_id):
            raise HTTPException(status_code=400, detail=f"O Edital com ID {projeto_data.edital_id} não existe.")

        # Cria o projeto
        return self.projeto_repo.create(projeto_data)

    def listar_projetos(self):
        return self.projeto_repo.get_all_active()

    def deletar_projeto(self, projeto_id: int):
        projeto = self.projeto_repo.get_by_id(projeto_id)
        if not projeto:
            raise HTTPException(status_code=404, detail="Projeto não encontrado.")
        return self.projeto_repo.soft_delete(projeto_id)