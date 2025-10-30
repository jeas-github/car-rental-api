
-- Tabela de Clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    cpf VARCHAR(14) UNIQUE,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    cnh VARCHAR(20),
    endereco TEXT,
    referencias TEXT,
    senha_hash VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Funcionários
CREATE TABLE funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha_hash VARCHAR(255),
    tipo_acesso ENUM('atendente', 'gerente') DEFAULT 'atendente',
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Veículos
CREATE TABLE veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    ano INT,
    placa VARCHAR(10) UNIQUE,
    cor VARCHAR(20),
    num_portas INT,
    combustivel VARCHAR(20),
    valor_diaria DECIMAL(10,2),
    status ENUM('disponível', 'reservado', 'alugado', 'em_manutencao', 'em_venda', 'baixado') DEFAULT 'disponível',
    data_entrada DATE,
    acessorios TEXT
);

-- Tabela de Reservas
CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    veiculo_id INT,
    data_inicio DATETIME,
    data_fim DATETIME,
    protocolo VARCHAR(100),
    status ENUM('pendente', 'confirmada', 'cancelada'),
    valor_estimado DECIMAL(10,2),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id)
);

-- Tabela de Locações
CREATE TABLE locacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    funcionario_id INT,
    veiculo_id INT,
    reserva_id INT,
    data_inicio DATETIME,
    data_fim DATETIME,
    data_devolucao DATETIME,
    quilometragem_inicio INT,
    quilometragem_fim INT,
    combustivel_inicio VARCHAR(10),
    combustivel_fim VARCHAR(10),
    adicionais TEXT,
    valor_final DECIMAL(10,2),
    status ENUM('ativa', 'finalizada'),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id),
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id),
    FOREIGN KEY (reserva_id) REFERENCES reservas(id)
);

-- Tabela de Multas
CREATE TABLE multas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    locacao_id INT,
    descricao TEXT,
    valor DECIMAL(10,2),
    data DATE,
    paga BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (locacao_id) REFERENCES locacoes(id)
);

-- Tabela de Manutenções
CREATE TABLE manutencoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    veiculo_id INT,
    tipo VARCHAR(50),
    descricao TEXT,
    data DATE,
    quilometragem INT,
    custo_estimado DECIMAL(10,2),
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id)
);

-- Tabela de Pagamentos
CREATE TABLE pagamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    locacao_id INT,
    tipo_pagamento ENUM('cartao', 'boleto'),
    valor DECIMAL(10,2),
    status ENUM('pendente', 'pago', 'estornado'),
    data_pagamento DATETIME,
    FOREIGN KEY (locacao_id) REFERENCES locacoes(id)
);
