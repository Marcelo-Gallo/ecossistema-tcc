-- Tabela para gerenciar os Atores da Tríplice Hélice 
CREATE TABLE ator (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo_helice VARCHAR(50) NOT NULL CHECK (tipo_helice IN ('GOVERNO', 'INDUSTRIA', 'UNIVERSIDADE')),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletado_em TIMESTAMP DEFAULT NULL 
);

-- Tabela de Demandas (Problemas prospectados)
CREATE TABLE demanda (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    ator_id INTEGER NOT NULL,
    area_cnpq VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletado_em TIMESTAMP DEFAULT NULL, 
    FOREIGN KEY (ator_id) REFERENCES ator(id) ON DELETE RESTRICT
);

-- Tabela de Expertises (Ofertas de conhecimento científico)
CREATE TABLE expertise (
    id SERIAL PRIMARY KEY,
    area_conhecimento VARCHAR(255) NOT NULL,
    area_cnpq VARCHAR(100) NOT NULL,
    link_lattes VARCHAR(255),        -- Link opcional para o currículo
    pesquisador_responsavel VARCHAR(255) NOT NULL,
    ator_id INTEGER NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletado_em TIMESTAMP DEFAULT NULL, 
    FOREIGN KEY (ator_id) REFERENCES ator(id) ON DELETE RESTRICT
);

-- Portfólio da Expertise (Acervo e Projetos Prévios)
CREATE TABLE portfolio_expertise (
    id SERIAL PRIMARY KEY,
    expertise_id INTEGER NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('ARTIGO_CIENTIFICO', 'PROJETO_EXTENSAO', 'PATENTE', 'OUTROS')),
    titulo VARCHAR(255) NOT NULL,
    ano_publicacao INTEGER NOT NULL,
    link_acesso VARCHAR(255), -- Link do DOI ou repositório
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletado_em TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (expertise_id) REFERENCES expertise(id) ON DELETE RESTRICT
);

-- Tabela de Editais 
CREATE TABLE edital (
    id SERIAL PRIMARY KEY,
    codigo_identificacao VARCHAR(50) UNIQUE NOT NULL,
    orcamento_disponivel NUMERIC(15, 2) NOT NULL,
    data_abertura DATE NOT NULL,
    data_fechamento DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletado_em TIMESTAMP DEFAULT NULL 
);

-- Tabela Associativa Forte: Projeto de Inovação
CREATE TABLE projeto_inovacao (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    demanda_id INTEGER NOT NULL,
    expertise_id INTEGER NOT NULL,
    edital_id INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'EM_ANALISE',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletado_em TIMESTAMP DEFAULT NULL, 
    FOREIGN KEY (demanda_id) REFERENCES demanda(id) ON DELETE RESTRICT,
    FOREIGN KEY (expertise_id) REFERENCES expertise(id) ON DELETE RESTRICT,
    FOREIGN KEY (edital_id) REFERENCES edital(id) ON DELETE RESTRICT
);

-- Tabela de Membros do Projeto 
CREATE TABLE membro_projeto (
    id SERIAL PRIMARY KEY,
    projeto_id INTEGER NOT NULL,
    nome_membro VARCHAR(255) NOT NULL,
    papel VARCHAR(100) NOT NULL, 
    valor_bolsa_mensal NUMERIC(10, 2) DEFAULT 0.00,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletado_em TIMESTAMP DEFAULT NULL, 
    FOREIGN KEY (projeto_id) REFERENCES projeto_inovacao(id) ON DELETE RESTRICT
);

-- Tabela de Pagamentos de Bolsas (Trilha de auditoria)
CREATE TABLE pagamento_bolsa (
    id SERIAL PRIMARY KEY,
    membro_id INTEGER NOT NULL,
    mes_referencia VARCHAR(7) NOT NULL, 
    valor_pago NUMERIC(10, 2) NOT NULL,
    data_pagamento DATE NOT NULL,
    codigo_transacao VARCHAR(100) UNIQUE, 
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletado_em TIMESTAMP DEFAULT NULL, 
    FOREIGN KEY (membro_id) REFERENCES membro_projeto(id) ON DELETE RESTRICT
);