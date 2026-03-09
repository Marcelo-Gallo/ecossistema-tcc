from pydantic import BaseModel

class DoacaoRequest(BaseModel):
    doador_id: int
    valor: float

class DoacaoResponse(BaseModel):
    mensagem: str
    codigo_transacao: str
    novo_score: float