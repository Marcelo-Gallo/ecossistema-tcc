from pydantic import BaseModel
from typing import List, Optional

class ProjetoConcluidoResponse(BaseModel):
    id: int
    titulo: str
    demanda_id: int
    expertise_id: int
    status: str

class AporteTransparenciaResponse(BaseModel):
    codigo_transacao: str
    doador_nome: str
    valor: float
    data_aporte: str