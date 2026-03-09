class DoacaoRepository:
    def __init__(self, db_connection):
        self.conn = db_connection

    def registrar_aporte(self, doador_id: int, valor: float, codigo_transacao: str):
        query = """
            INSERT INTO aporte (doador_id, valor, codigo_transacao, status)
            VALUES (%s, %s, %s, 'CONCLUIDO') RETURNING id;
        """
        with self.conn.cursor() as cursor:
            cursor.execute(query, (doador_id, valor, codigo_transacao))
            self.conn.commit()
            return cursor.fetchone()['id']

    def atualizar_score(self, doador_id: int, pontos: float):
        query = """
            UPDATE score_doador 
            SET pontuacao_total = pontuacao_total + %s, atualizado_em = CURRENT_TIMESTAMP
            WHERE doador_id = %s RETURNING pontuacao_total;
        """
        with self.conn.cursor() as cursor:
            cursor.execute(query, (pontos, doador_id))
            self.conn.commit()
            return cursor.fetchone()['pontuacao_total']