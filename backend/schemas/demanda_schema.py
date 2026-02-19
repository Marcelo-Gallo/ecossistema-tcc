from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class AreaCNPq(str, Enum):
    CIENCIAS_EXATAS_E_DA_TERRA = 'CIENCIAS_EXATAS_E_DA_TERRA'
    CIENCIAS_BIOLOGICAS = 'CIENCIAS_BIOLOGICAS'
    ENGENHARIAS = 'ENGENHARIAS'
    CIENCIAS_DA_SAUDE = 'CIENCIAS_DA_SAUDE'
    CIENCIAS_AGRARIAS = 'CIENCIAS_AGRARIAS'
    CIENCIAS_SOCIAIS_APLICADAS = 'CIENCIAS_SOCIAIS_APLICADAS'
    CIENCIAS_HUMANAS = 'CIENCIAS_HUMANAS'
    LINGUISTICA_LETRAS_E_ARTES = 'LINGUISTICA_LETRAS_E_ARTES'

class DemandaBase(BaseModel):
    titulo: str = Field(..., max_length=255)
    descricao: str
    ator_id: int
    area_cnpq: AreaCNPq

class DemandaCreate(DemandaBase):
    pass

class DemandaResponse(DemandaBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime
    deletado_em: Optional[datetime] = None

    class Config:
        from_attributes = True