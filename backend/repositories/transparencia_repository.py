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
        
