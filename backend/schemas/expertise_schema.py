from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from schemas.demanda_schema import AreaCNPq #dicionario estático

class ExpertiseBase(BaseModel):
    area_conhecimento: str = Field(..., max_length=255)
    area_cnpq: AreaCNPq
    link_lattes: Optional[str] = Field(None, max_length=255)
    pesquisador_responsavel: str = Field(..., max_length=255)
    ator_id: int

class ExpertiseCreate(ExpertiseBase):
    pass

class ExpertiseResponse(ExpertiseBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime
    deletado_em: Optional[datetime] = None

    class Config:
        from_attributes = True