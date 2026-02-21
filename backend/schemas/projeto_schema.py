from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class StatusProjeto(str, Enum):
    EM_ANALISE = 'EM_ANALISE'
    APROVADO = 'APROVADO'
    REJEITADO = 'REJEITADO'
    EM_EXECUCAO = 'EM_EXECUCAO'
    CONCLUIDO = 'CONCLUIDO'

class ProjetoBase(BaseModel):
    titulo: str = Field(..., max_length=255)
    demanda_id: int
    expertise_id: int
    edital_id: int
    status: StatusProjeto = StatusProjeto.EM_ANALISE

class ProjetoCreate(ProjetoBase):
    pass

class ProjetoResponse(ProjetoBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime
    deletado_em: Optional[datetime] = None

    class Config:
        from_attributes = True