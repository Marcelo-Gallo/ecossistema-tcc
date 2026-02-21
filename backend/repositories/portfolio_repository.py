from schemas.portfolio_schema import PortfolioCreate

class PortfolioRepository:
    def __init__(self, conn):
        self.conn = conn

    def create(self, portfolio: PortfolioCreate):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO portfolio_expertise (expertise_id, tipo, titulo, ano_publicacao, link_acesso) 
                VALUES (%s, %s, %s, %s, %s) RETURNING *;
                """,
                (
                    portfolio.expertise_id, 
                    portfolio.tipo.value, 
                    portfolio.titulo, 
                    portfolio.ano_publicacao, 
                    portfolio.link_acesso
                )
            )
            novo_portfolio = cursor.fetchone()
            self.conn.commit()
            return novo_portfolio

    def get_all_active(self):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM portfolio_expertise WHERE deletado_em IS NULL;")
            return cursor.fetchall()

    def get_by_id(self, portfolio_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT * FROM portfolio_expertise WHERE id = %s AND deletado_em IS NULL;", (portfolio_id,))
            return cursor.fetchone()

    def soft_delete(self, portfolio_id: int):
        with self.conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE portfolio_expertise 
                SET deletado_em = CURRENT_TIMESTAMP 
                WHERE id = %s RETURNING *;
                """,
                (portfolio_id,)
            )
            portfolio_deletado = cursor.fetchone()
            self.conn.commit()
            return portfolio_deletado