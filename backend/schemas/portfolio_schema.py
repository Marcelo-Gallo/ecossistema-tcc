from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class TipoPortfolio(str, Enum):
    ARTIGO_CIENTIFICO = 'ARTIGO_CIENTIFICO'
    PROJETO_EXTENSAO = 'PROJETO_EXTENSAO'
    PATENTE = 'PATENTE'
    OUTROS = 'OUTROS'

class PortfolioBase(BaseModel):
    expertise_id: int
    tipo: TipoPortfolio
    titulo: str = Field(..., max_length=255)
    ano_publicacao: int
    link_acesso: Optional[str] = Field(None, max_length=255)

class PortfolioCreate(PortfolioBase):
    pass

class PortfolioResponse(PortfolioBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime
    deletado_em: Optional[datetime] = None

    class Config:
        from_attributes = True