from schemas.pagamento_schema import PagamentoCreate

class PagamentoRepository:
    def __init__(self, conn):
        self.conn = conn

    def create(self, pagamento: PagamentoCreate):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO pagamento_bolsa (membro_id, mes_referencia, valor_pago, data_pagamento, codigo_transacao) 
                VALUES (%s, %s, %s, %s, %s) RETURNING *;
                """,
                (
                    pagamento.membro_id, 
                    pagamento.mes_referencia, 
                    pagamento.valor_pago, 
                    pagamento.data_pagamento, 
                    pagamento.codigo_transacao
                )
            )
            novo_pagamento = cursor.fetchone()
            self.conn.commit()
            return novo_pagamento

    def get_all_active(self):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM pagamento_bolsa WHERE deletado_em IS NULL;")
            return cursor.fetchall()

    def get_by_id(self, pagamento_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM pagamento_bolsa WHERE id = %s AND deletado_em IS NULL;", (pagamento_id,))
            return cursor.fetchone()

    def soft_delete(self, pagamento_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE pagamento_bolsa 
                SET deletado_em = CURRENT_TIMESTAMP 
                WHERE id = %s RETURNING *;
                """,
                (pagamento_id,)
            )
            pagamento_deletado = cursor.fetchone()
            self.conn.commit()
            return pagamento_deletado