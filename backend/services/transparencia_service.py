from repositories.transparencia_repository import TransparenciaRepository

class TransparenciaService:
    def __init__(self, repo: TransparenciaRepository):
        self.repo = repo

    def obter_painel_projetos(self):
        projetos = self.repo.get_projetos_concluidos()
        return projetos
        
    def obter_ultimos_aportes(self):
        return self.repo.get_ultimos_aportes()