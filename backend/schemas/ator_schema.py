from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class TipoHelice(str, Enum):
    GOVERNO = 'GOVERNO'
    INDUSTRIA = 'INDUSTRIA'
    UNIVERSIDADE = 'UNIVERSIDADE'

class AtorBase(BaseModel):
    nome: str = Field(..., max_length=255)
    tipo_helice: TipoHelice

class AtorCreate(AtorBase):
    pass

class AtorResponse(AtorBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime
    deletado_em: Optional[datetime] = None

    class Config:
        from_attributes = True