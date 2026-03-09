class TransparenciaRepository:
    def __init__(self, db_connection):
        self.conn = db_connection

    def get_projetos_concluidos(self):
        query = """
            SELECT id, titulo, demanda_id, expertise_id, status 
            FROM projeto_inovacao 
            WHERE status = 'CONCLUIDO'
        """
        with self.conn.cursor() as cursor:
            cursor.execute(query)
            return cursor.fetchall()
            
    def get_ultimos_aportes(self):
        query = """
            SELECT a.codigo_transacao, d.nome as doador_nome, a.valor, 
                   TO_CHAR(a.data_aporte, 'DD/MM/YYYY HH24:MI') as data_aporte
            FROM aporte a
            JOIN doador d ON a.doador_id = d.id
            ORDER BY a.data_aporte DESC
            LIMIT 10
        """
        with self.conn.cursor() as cursor:
            cursor.execute(query)
            return cursor.fetchall()