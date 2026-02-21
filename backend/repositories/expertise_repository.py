from schemas.expertise_schema import ExpertiseCreate

class ExpertiseRepository:
    def __init__(self, conn):
        self.conn = conn

    def create(self, expertise: ExpertiseCreate):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO expertise (area_conhecimento, area_cnpq, link_lattes, pesquisador_responsavel, ator_id) 
                VALUES (%s, %s, %s, %s, %s) RETURNING *;
                """,
                (
                    expertise.area_conhecimento, 
                    expertise.area_cnpq.value, 
                    expertise.link_lattes, 
                    expertise.pesquisador_responsavel, 
                    expertise.ator_id
                )
            )
            nova_expertise = cursor.fetchone()
            self.conn.commit()
            return nova_expertise

    def get_all_active(self):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM expertise WHERE deletado_em IS NULL;")
            return cursor.fetchall()

    def get_by_id(self, expertise_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM expertise WHERE id = %s AND deletado_em IS NULL;", (expertise_id,))
            return cursor.fetchone()

    def soft_delete(self, expertise_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE expertise 
                SET deletado_em = CURRENT_TIMESTAMP 
                WHERE id = %s RETURNING *;
                """,
                (expertise_id,)
            )
            expertise_deletada = cursor.fetchone()
            self.conn.commit()
            return expertise_deletada