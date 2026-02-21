from fastapi import APIRouter, Depends
from typing import List
from database import get_db_connection
from repositories.portfolio_repository import PortfolioRepository
from repositories.expertise_repository import ExpertiseRepository
from services.portfolio_service import PortfolioService
from schemas.portfolio_schema import PortfolioCreate, PortfolioResponse

router = APIRouter(prefix="/api/portfolios", tags=["Portfólio de Expertise"])

def get_portfolio_service(conn = Depends(get_db_connection)):
    portfolio_repo = PortfolioRepository(conn)
    expertise_repo = ExpertiseRepository(conn)
    return PortfolioService(portfolio_repo, expertise_repo)

@router.post("/", response_model=PortfolioResponse, status_code=201)
async def criar_portfolio(portfolio: PortfolioCreate, service: PortfolioService = Depends(get_portfolio_service)):
    return service.criar_portfolio(portfolio)

@router.get("/", response_model=List[PortfolioResponse])
async def listar_portfolios(service: PortfolioService = Depends(get_portfolio_service)):
    return service.listar_portfolios()

@router.delete("/{portfolio_id}", response_model=PortfolioResponse)
async def deletar_portfolio(portfolio_id: int, service: PortfolioService = Depends(get_portfolio_service)):
    return service.deletar_portfolio(portfolio_id)