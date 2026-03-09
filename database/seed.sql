-- 1. Inserindo Atores da Tríplice Hélice
INSERT INTO ator (nome, tipo_helice) VALUES
('Prefeitura Municipal de Votuporanga', 'GOVERNO'),
('Prefeitura Municipal de Tanabi', 'GOVERNO'),
('Indústria Moveleira Noroeste', 'INDUSTRIA'),
('Santa Casa de Misericórdia', 'INDUSTRIA'),
('IFSP Câmpus Votuporanga', 'UNIVERSIDADE');

-- 2. Inserindo Doadores (A "Fé Cívica")
INSERT INTO doador (nome, tipo_documento, documento, tipo_doador) VALUES
('TechCorp Inovações', 'CNPJ', '12.345.678/0001-99', 'EMPRESA'),
('Maria Souza', 'CPF', '111.222.333-44', 'PESSOA_FISICA');

-- 3. Inserindo Aportes Iniciais (O Fundo Patrimonial ganhando tração)
-- Total de R$ 10.000.000,00 no Corpus. Rendimento (0.8%) = R$ 80.000,00 livres.
INSERT INTO aporte (doador_id, valor, codigo_transacao) VALUES
(1, 9500000.00, 'TXN-INITIAL-001'),
(2, 500000.00, 'TXN-INITIAL-002');

-- 4. Inserindo o Score (Incentivo de confiança)
INSERT INTO score_doador (doador_id, pontuacao_total) VALUES
(1, 950000.00),
(2, 50000.00);

-- 5. Demandas (Problemas do Município/Indústria)
INSERT INTO demanda (titulo, descricao, ator_id, area_cnpq) VALUES
('Otimização Semafórica Inteligente', 'O centro da cidade sofre com gargalos no trânsito. Necessidade de otimização via software.', 1, 'CIENCIAS_EXATAS_E_DA_TERRA'),
('Captação de Água Pluvial para Escolas', 'Estruturação de cisternas integradas para reduzir o custo hídrico na rede municipal de ensino.', 2, 'ENGENHARIAS'),
('Sistema de Visão Computacional para Análise de Radiografias', 'Necessidade de um sistema web baseado em visão computacional e inteligência artificial para detecção automática de anomalias em imagens médicas e radiografias de pacientes.', 4, 'CIENCIAS_DA_SAUDE');

-- 6. Expertises (Ofertas de Solução da Universidade)
INSERT INTO expertise (area_conhecimento, area_cnpq, pesquisador_responsavel, ator_id) VALUES
('Sistemas Inteligentes e Otimização', 'CIENCIAS_EXATAS_E_DA_TERRA', 'Prof. Dr. Marcelo Murari', 5),
('Técnicas Construtivas Sustentáveis', 'ENGENHARIAS', 'Prof. Roberto Alves', 5),
('Visão Computacional em Imagens Médicas', 'CIENCIAS_DA_SAUDE', 'Dra. Ana Silva', 5);

-- 7. Portfólio das Expertises (O Golden Match da Dra. Ana Silva)
INSERT INTO portfolio_expertise (expertise_id, tipo, titulo, ano_publicacao) VALUES
(1, 'ARTIGO_CIENTIFICO', 'Algoritmos de Otimização em Cidades Inteligentes', 2024),
(1, 'PROJETO_EXTENSAO', 'IA aplicada à mobilidade urbana', 2023),
(2, 'PROJETO_EXTENSAO', 'Sistemas de cisternas de baixo custo para edifícios públicos', 2025),
(3, 'ARTIGO_CIENTIFICO', 'Detecção de anomalias em radiografias usando visão computacional', 2023),
(3, 'PATENTE', 'Sistema web de inteligência artificial para análise de imagens médicas', 2024),
(3, 'PROJETO_EXTENSAO', 'Visão computacional aplicada à saúde e radiografias', 2025),
(3, 'ARTIGO_CIENTIFICO', 'Análise automática de radiografias com IA e visão computacional', 2026);

-- 8. Edital Fictício (A fonte pagadora)
-- Gastando R$ 45.000,00. Sobrarão R$ 35.000,00 livres para o próximo edital.
INSERT INTO edital (codigo_identificacao, orcamento_disponivel, data_abertura, data_fechamento) VALUES
('EDITAL-FUNDO-001/2026', 45000.00, '2026-01-01', '2026-12-31');

-- 9. Projetos Concluídos (O ACERVO MUNICIPAL)
INSERT INTO projeto_inovacao (titulo, demanda_id, expertise_id, edital_id, status) VALUES
('Implantação de Semáforos Inteligentes no Centro', 1, 1, 1, 'CONCLUIDO'),
('Cisternas Sustentáveis na Escola Municipal', 2, 2, 1, 'CONCLUIDO');