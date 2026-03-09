/*
Arquivo para popular o banco, dividido em 9 etapas:
*/

-- 1. Inserindo Atores da Tríplice Hélice
INSERT INTO ator (nome, tipo_helice) VALUES
('Prefeitura Municipal de Votuporanga', 'GOVERNO'),
('Prefeitura Municipal de Tanabi', 'GOVERNO'),
('Indústria Moveleira Noroeste', 'INDUSTRIA'),
('IFSP Câmpus Votuporanga', 'UNIVERSIDADE');

-- 2. Inserindo Doadores
INSERT INTO doador (nome, tipo_documento, documento, tipo_doador) VALUES
('TechCorp Inovações', 'CNPJ', '12.345.678/0001-99', 'EMPRESA'),
('Maria Souza', 'CPF', '111.222.333-44', 'PESSOA_FISICA');

-- 3. Inserindo Aportes Iniciais (O Fundo Patrimonial ganhando tração)
INSERT INTO aporte (doador_id, valor, codigo_transacao) VALUES
(1, 50000.00, 'TXN-INITIAL-001'),
(2, 2500.00, 'TXN-INITIAL-002');

-- 4. Inserindo o Score (Exemplo: 1 ponto de score para cada R$ 10 aportados)
INSERT INTO score_doador (doador_id, pontuacao_total) VALUES
(1, 5000.00),
(2, 250.00);

-- 5. Demandas (Problemas do Município/Indústria)
INSERT INTO demanda (titulo, descricao, ator_id, area_cnpq) VALUES
('Otimização Semafórica Inteligente', 'O centro da cidade sofre com gargalos no trânsito. Necessidade de otimização via software.', 1, 'CIENCIAS_EXATAS_E_DA_TERRA'),
('Captação de Água Pluvial para Escolas', 'Estruturação de cisternas integradas para reduzir o custo hídrico na rede municipal de ensino.', 2, 'ENGENHARIAS'),
('Automação do Corte de Madeira', 'Redução de desperdício na linha de produção.', 3, 'ENGENHARIAS');

-- 6. Expertises (Ofertas de Solução da Universidade)
INSERT INTO expertise (area_conhecimento, area_cnpq, pesquisador_responsavel, ator_id) VALUES
('Sistemas Inteligentes e Otimização', 'CIENCIAS_EXATAS_E_DA_TERRA', 'Prof. Dr. Marcelo Murari', 4),
('Técnicas Construtivas Sustentáveis', 'ENGENHARIAS', 'Prof. Roberto Alves', 4);

-- 7. Portfólio das Expertises (Garante a "Autoridade" no Matchmaking)
INSERT INTO portfolio_expertise (expertise_id, tipo, titulo, ano_publicacao) VALUES
(1, 'ARTIGO_CIENTIFICO', 'Algoritmos de Otimização em Cidades Inteligentes', 2024),
(1, 'PROJETO_EXTENSAO', 'IA aplicada à mobilidade urbana', 2023),
(2, 'PROJETO_EXTENSAO', 'Sistemas de cisternas de baixo custo para edifícios públicos', 2025);

-- 8. Edital Fictício (A fonte pagadora)
INSERT INTO edital (codigo_identificacao, orcamento_disponivel, data_abertura, data_fechamento) VALUES
('EDITAL-FUNDO-001/2025', 100000.00, '2025-01-01', '2025-12-31');

-- 9. Projetos Concluídos (O ACERVO MUNICIPAL MOCKADO PARA A TRANSPARÊNCIA)
-- É isso aqui que o Painel de Transparência vai puxar para provar o impacto gerado
INSERT INTO projeto_inovacao (titulo, demanda_id, expertise_id, edital_id, status) VALUES
('Implantação de Semáforos Inteligentes no Centro', 1, 1, 1, 'CONCLUIDO'),
('Cisternas Sustentáveis na Escola Municipal', 2, 2, 1, 'CONCLUIDO');