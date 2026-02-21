from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from decimal import Decimal

class PagamentoBase(BaseModel):
    membro_id: int
    mes_referencia: str = Field(..., max_length=7, description="Formato MM/AAAA ou YYYY-MM")
    valor_pago: Decimal = Field(..., gt=0)
    data_pagamento: date
    codigo_transacao: Optional[str] = Field(None, max_length=100)

class PagamentoCreate(PagamentoBase):
    pass

class PagamentoResponse(PagamentoBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime
    deletado_em: Optional[datetime] = None

    class Config:
        from_attributes = True