from schemas.projeto_schema import ProjetoCreate

class ProjetoRepository:
    def __init__(self, conn):
        self.conn = conn

    def create(self, projeto: ProjetoCreate):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO projeto_inovacao (titulo, demanda_id, expertise_id, edital_id, status) 
                VALUES (%s, %s, %s, %s, %s) RETURNING *;
                """,
                (
                    projeto.titulo, 
                    projeto.demanda_id, 
                    projeto.expertise_id, 
                    projeto.edital_id, 
                    projeto.status.value
                )
            )
            novo_projeto = cursor.fetchone()
            self.conn.commit()
            return novo_projeto

    def get_all_active(self):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM projeto_inovacao WHERE deletado_em IS NULL;")
            return cursor.fetchall()

    def get_by_id(self, projeto_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM projeto_inovacao WHERE id = %s AND deletado_em IS NULL;", (projeto_id,))
            return cursor.fetchone()

    def soft_delete(self, projeto_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE projeto_inovacao 
                SET deletado_em = CURRENT_TIMESTAMP 
                WHERE id = %s RETURNING *;
                """,
                (projeto_id,)
            )
            projeto_deletado = cursor.fetchone()
            self.conn.commit()
            return projeto_deletado