from pydantic import BaseModel
from typing import List, Optional

class ProjetoConcluidoResponse(BaseModel):
    id: int
    titulo: str
    demanda_id: int
    expertise_id: int
    status: str

