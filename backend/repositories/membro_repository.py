from schemas.membro_schema import MembroCreate

class MembroRepository:
    def __init__(self, conn):
        self.conn = conn

    def create(self, membro: MembroCreate):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO membro_projeto (projeto_id, nome_membro, papel, valor_bolsa_mensal) 
                VALUES (%s, %s, %s, %s) RETURNING *;
                """,
                (
                    membro.projeto_id, 
                    membro.nome_membro, 
                    membro.papel, 
                    membro.valor_bolsa_mensal
                )
            )
            novo_membro = cursor.fetchone()
            self.conn.commit()
            return novo_membro

    def get_all_active(self):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM membro_projeto WHERE deletado_em IS NULL;")
            return cursor.fetchall()

    def get_by_id(self, membro_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM membro_projeto WHERE id = %s AND deletado_em IS NULL;", (membro_id,))
            return cursor.fetchone()

    def soft_delete(self, membro_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE membro_projeto 
                SET deletado_em = CURRENT_TIMESTAMP 
                WHERE id = %s RETURNING *;
                """,
                (membro_id,)
            )
            membro_deletado = cursor.fetchone()
            self.conn.commit()
            return membro_deletado