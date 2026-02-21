from fastapi import HTTPException
from repositories.portfolio_repository import PortfolioRepository
from repositories.expertise_repository import ExpertiseRepository
from schemas.portfolio_schema import PortfolioCreate

class PortfolioService:
    def __init__(self, portfolio_repo: PortfolioRepository, expertise_repo: ExpertiseRepository):
        self.portfolio_repo = portfolio_repo
        self.expertise_repo = expertise_repo

    def criar_portfolio(self, portfolio_data: PortfolioCreate):
        # Validação da Chave Estrangeira ==> A Expertise precisa existir
        expertise_existente = self.expertise_repo.get_by_id(portfolio_data.expertise_id)
        if not expertise_existente:
            raise HTTPException(
                status_code=400, 
                detail=f"Falha ao adicionar portfólio: A expertise com ID {portfolio_data.expertise_id} não existe ou foi excluída."
            )
        
        return self.portfolio_repo.create(portfolio_data)

    def listar_portfolios(self):
        return self.portfolio_repo.get_all_active()

    def deletar_portfolio(self, portfolio_id: int):
        portfolio = self.portfolio_repo.get_by_id(portfolio_id)
        if not portfolio:
            raise HTTPException(status_code=404, detail="Item de portfólio não encontrado.")
        return self.portfolio_repo.soft_delete(portfolio_id)