from fastapi import APIRouter, Depends
from database import get_db_connection
from repositories.demanda_repository import DemandaRepository
from repositories.expertise_repository import ExpertiseRepository
from repositories.portfolio_repository import PortfolioRepository
from services.matchmaking_service import MatchmakingService

router = APIRouter(prefix="/api/matchmaking", tags=["Motor de Matchmaking"])

def get_matchmaking_service(conn = Depends(get_db_connection)):
    demanda_repo = DemandaRepository(conn)
    expertise_repo = ExpertiseRepository(conn)
    portfolio_repo = PortfolioRepository(conn)
    return MatchmakingService(demanda_repo, expertise_repo, portfolio_repo)

@router.get("/{demanda_id}")
async def obter_sugestoes_match(demanda_id: int, service: MatchmakingService = Depends(get_matchmaking_service)):
    return service.calcular_match(demanda_id)