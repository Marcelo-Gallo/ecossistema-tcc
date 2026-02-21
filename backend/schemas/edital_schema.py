from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from decimal import Decimal

class EditalBase(BaseModel):
    codigo_identificacao: str = Field(..., max_length=50)
    orcamento_disponivel: Decimal = Field(..., gt=0, description="O valor deve ser maior que zero")
    data_abertura: date
    data_fechamento: date

class EditalCreate(EditalBase):
    pass

class EditalResponse(EditalBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime
    deletado_em: Optional[datetime] = None

    class Config:
        from_attributes = True