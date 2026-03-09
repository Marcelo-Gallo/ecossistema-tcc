import asyncio
import uuid
from repositories.doacao_repository import DoacaoRepository

class DoacaoService:
    def __init__(self, repo: DoacaoRepository):
        self.repo = repo

    async def processar_doacao(self, doador_id: int, valor: float):
        # MOCK DO GATEWAY: Simula a latência de um banco ou processadora de pagamentos
        await asyncio.sleep(2.0) 

        # Gera um identificador único para a transparência pública
        codigo_transacao = f"TXN-{uuid.uuid4().hex[:8].upper()}"

        # Regista o dinheiro real no Fundo Patrimonial
        self.repo.registrar_aporte(doador_id, valor, codigo_transacao)

        # Cálculo da Contrapartida (O Incentivo de Confiança)
        # Regra de negócio inicial: 1 ponto de Score a cada R$ 10 aportados
        pontos_ganhos = valor / 10.0
        
        # Atualiza o perfil do Doador
        novo_score = self.repo.atualizar_score(doador_id, pontos_ganhos)

        return {
            "mensagem": "Doação processada e confirmada com sucesso pelo Fundo.",
            "codigo_transacao": codigo_transacao,
            "novo_score": novo_score
        }