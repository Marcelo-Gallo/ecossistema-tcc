from schemas.edital_schema import EditalCreate

class EditalRepository:
    def __init__(self, conn):
        self.conn = conn

    def create(self, edital: EditalCreate):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO edital (codigo_identificacao, orcamento_disponivel, data_abertura, data_fechamento) 
                VALUES (%s, %s, %s, %s) RETURNING *;
                """,
                (
                    edital.codigo_identificacao, 
                    edital.orcamento_disponivel, 
                    edital.data_abertura, 
                    edital.data_fechamento
                )
            )
            novo_edital = cursor.fetchone()
            self.conn.commit()
            return novo_edital

    def get_all_active(self):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM edital WHERE deletado_em IS NULL;")
            return cursor.fetchall()

    def get_by_id(self, edital_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM edital WHERE id = %s AND deletado_em IS NULL;", (edital_id,))
            return cursor.fetchone()

    def soft_delete(self, edital_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE edital 
                SET deletado_em = CURRENT_TIMESTAMP 
                WHERE id = %s RETURNING *;
                """,
                (edital_id,)
            )
            edital_deletado = cursor.fetchone()
            self.conn.commit()
            return edital_deletado