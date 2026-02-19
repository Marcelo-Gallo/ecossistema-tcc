from schemas.demanda_schema import DemandaCreate

class DemandaRepository:
    def __init__(self, conn):
        self.conn = conn

    def create(self, demanda: DemandaCreate):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO demanda (titulo, descricao, ator_id, area_cnpq) 
                VALUES (%s, %s, %s, %s) RETURNING *;
                """,
                (demanda.titulo, demanda.descricao, demanda.ator_id, demanda.area_cnpq.value)
            )
            nova_demanda = cursor.fetchone()
            self.conn.commit()
            return nova_demanda

    def get_all_active(self):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM demanda WHERE deletado_em IS NULL;")
            return cursor.fetchall()

    def get_by_id(self, demanda_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM demanda WHERE id = %s AND deletado_em IS NULL;", (demanda_id,))
            return cursor.fetchone()

    def soft_delete(self, demanda_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE demanda 
                SET deletado_em = CURRENT_TIMESTAMP 
                WHERE id = %s RETURNING *;
                """,
                (demanda_id,)
            )
            demanda_deletada = cursor.fetchone()
            self.conn.commit()
            return demanda_deletada