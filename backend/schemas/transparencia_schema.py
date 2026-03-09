from pydantic import BaseModel
from typing import List

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

class TransparenciaKPIsResponse(BaseModel):
    corpus_total: float
    teto_rendimento: float
    orcamento_empenhado: float
    projetos_ativos: int
    demandas_mapeadas: int