from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal

class MembroBase(BaseModel):
    projeto_id: int
    nome_membro: str = Field(..., max_length=255)
    papel: str = Field(..., max_length=100, description="Ex: Pesquisador Líder, Bolsista de Iniciação Científica, etc.")
    valor_bolsa_mensal: Decimal = Field(default=0.00, ge=0)

class MembroCreate(MembroBase):
    pass

class MembroResponse(MembroBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime
    deletado_em: Optional[datetime] = None

    class Config:
        from_attributes = True