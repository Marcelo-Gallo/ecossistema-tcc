from fastapi import HTTPException
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from repositories.demanda_repository import DemandaRepository
from repositories.expertise_repository import ExpertiseRepository
from repositories.portfolio_repository import PortfolioRepository

class MatchmakingService:
    def __init__(self, demanda_repo: DemandaRepository, expertise_repo: ExpertiseRepository, portfolio_repo: PortfolioRepository):
        self.demanda_repo = demanda_repo
        self.expertise_repo = expertise_repo
        self.portfolio_repo = portfolio_repo

    def calcular_match(self, demanda_id: int):
        demanda = self.demanda_repo.get_by_id(demanda_id)
        if not demanda:
            raise HTTPException(status_code=404, detail="Demanda não encontrada.")

        # Filtro Absoluto: Mesma área do CNPq
        expertises_candidatas = self.expertise_repo.get_by_area_cnpq(demanda['area_cnpq'])
        
        if not expertises_candidatas:
            return [] # Nenhuma expertise na mesma área

        texto_demanda = f"{demanda['titulo']} {demanda['descricao']}"
        resultados = []

        for exp in expertises_candidatas:
            portfolio = self.portfolio_repo.get_by_expertise_id(exp['id'])
            
            # Concatena a área de conhecimento com os títulos dos projetos/artigos
            texto_exp = exp['area_conhecimento']
            for item in portfolio:
                texto_exp += f" {item['titulo']}"
                
            # Score de Similaridade Textual (TF-IDF + Cosine Similarity)
            # TF-IDF => Term Frequency - Inverse Document Frequency, que é uma técnica estatistica da ciencia de dados e processamento de linguagem natural usada para avaliar a relevância de uma palavra em um documento em relação a uma coleção inteira de documentos.
            # Vetoriza os textos para comparar o quão próximos eles são no espaço multidimensional
            vectorizer = TfidfVectorizer(stop_words=['o', 'a', 'de', 'para', 'com', 'em', 'um', 'uma']) # Stop words básicas
            
            try:
                tfidf_matrix = vectorizer.fit_transform([texto_demanda, texto_exp])
                similaridade = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
                score_texto = similaridade * 100
            except ValueError:
                # Ocorre se os textos forem vazios ou só tiverem stop words
                score_texto = 0.0

            # Score de Autoridade (Máximo de 100)
            # Considera-se que cada publicação soma 20 pontos de autoridade
            score_autoridade = min(len(portfolio) * 20, 100)
            
            # Equação Final (Pesos: 70% Texto, 30% Autoridade)
            score_total = (0.7 * score_texto) + (0.3 * score_autoridade)
            
            # Filtro de relevância mínima (ex: score total > 10)
            if score_total > 10:
                resultados.append({
                    "expertise_id": exp['id'],
                    "pesquisador_responsavel": exp['pesquisador_responsavel'],
                    "area_conhecimento": exp['area_conhecimento'],
                    "score_total": round(score_total, 2),
                    "detalhes": {
                        "score_texto": round(score_texto, 2),
                        "score_autoridade": score_autoridade,
                        "total_publicacoes": len(portfolio)
                    }
                })
                
        # Ordena os resultados do maior score para o menor
        return sorted(resultados, key=lambda x: x["score_total"], reverse=True)