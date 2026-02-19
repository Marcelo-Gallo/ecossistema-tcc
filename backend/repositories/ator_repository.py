from schemas.ator_schema import AtorCreate

class AtorRepository:
    def __init__(self, conn):
        self.conn = conn

    def create(self, ator: AtorCreate):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO ator (nome, tipo_helice) 
                VALUES (%s, %s) RETURNING *;
                """,
                (ator.nome, ator.tipo_helice.value)
            )
            novo_ator = cursor.fetchone()
            self.conn.commit()
            return novo_ator

    def get_all_active(self):
        with self.conn.cursor() as cursor:
            # Respeita o Soft Delete filtrando nulos
            cursor.execute("SELECT * FROM ator WHERE deletado_em IS NULL;")
            return cursor.fetchall()

    def get_by_id(self, ator_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM ator WHERE id = %s AND deletado_em IS NULL;", (ator_id,))
            return cursor.fetchone()

    def soft_delete(self, ator_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE ator 
                SET deletado_em = CURRENT_TIMESTAMP 
                WHERE id = %s RETURNING *;
                """,
                (ator_id,)
            )
            ator_deletado = cursor.fetchone()
            self.conn.commit()
            return ator_deletado