# discovery.md

## 1. Visão Geral do Projeto

Este projeto tem como objetivo desenvolver um **MVP (Mínimo Produto Viável)** de um sistema de **Locação de Veículos**, com foco na criação de uma **API funcional e bem estruturada**.  
A aplicação permitirá que **clientes realizem locações de veículos** e que a **empresa gerencie sua frota e reservas** de forma prática e eficiente.

### Propósito

Validar a proposta de um sistema digital de locação de veículos capaz de:

- Centralizar informações sobre clientes e frota.
- Automatizar processos de locação e devolução.
- Demonstrar viabilidade técnica e de negócio do produto.

### Público-Alvo

- **Clientes:** pessoas físicas que desejam alugar veículos de forma prática.
- **Funcionários:** responsáveis pelo cadastro e controle das locações.

---

## 2. Objetivos do MVP

- Implementar uma **API REST** que simula operações reais de locação.
- Demonstrar o funcionamento das principais funcionalidades do sistema.
- Validar a viabilidade do projeto a partir de fluxos e testes automatizados.

---

## 3. Funcionalidades do MVP

### Funcionalidades Essenciais

- **Gerenciamento de Clientes:** cadastro, edição, listagem e exclusão.
- **Gerenciamento de Veículos:** controle de disponibilidade e dados da frota.
- **Locação de Veículos:** registro de locações e devoluções.
- **Cálculo do Valor Total:** baseado nas diárias e tempo de utilização.

### Funcionalidades Futuras (fora do escopo do MVP)

- Pagamento online.
- Autenticação de usuários.
- Relatórios e painel administrativo.

---

## 4. Requisitos Funcionais

1. O sistema deve permitir o **cadastro de veículos e clientes**.
2. Deve ser possível **criar uma locação**, informando veículo, cliente e datas.
3. O sistema calculará automaticamente o **valor total** da locação.
4. Não será permitido alugar um veículo já em uso.
5. Todos os dados devem ser persistidos em um **banco relacional MySQL**.

---

## 5. Requisitos Não Funcionais

- O backend será construído com **Node.js**, **TypeScript** e **Fastify**.
- O **Prisma ORM** fará a comunicação com o **MySQL**.
- **Zod** será utilizado para validação de dados.
- Documentação via **Swagger/OpenAPI**.
- **ESLint e Prettier** serão aplicados para padronização do código.
- O sistema deve ser simples, modular e de fácil manutenção.

---

## 6. Escopo do MVP

O MVP mostrará um fluxo funcional completo:

- Cadastro de cliente.
- Cadastro de veículo.
- Criação de locação.
- Cálculo e encerramento da locação.

Essa versão é suficiente para validar a proposta do produto e comprovar sua viabilidade técnica.

---

## 7. Tecnologias Utilizadas

- **Node.js + TypeScript**
- **Fastify** (servidor backend)
- **Prisma ORM** (modelagem e manipulação de dados)
- **MySQL** (banco de dados relacional)
- **Zod** (validação de schemas)
- **Swagger/OpenAPI** (documentação da API)
- **ESLint + Prettier** (qualidade de código)
- **AdminJS** (painel administrativo para visualização dos dados)

---

## 8. Entregáveis

A partir deste Discovery, serão entregues:

- **API funcional** com rotas REST.
- **Banco de dados relacional modelado no Prisma.**
- **Documentação detalhada dos endpoints.**
- **Testes automatizados de integração e unidade.**
- **Repositório público no GitHub.**

---

## 9. Métrica de Validação do MVP

O MVP será considerado validado se:

- Permitir o cadastro, listagem e exclusão de clientes e veículos.
- Registrar e finalizar locações corretamente.
- Calcular o valor da locação conforme os dias alugados.
- Passar nos testes automatizados principais (ex: aluguel e devolução).

---

## 10. Conclusão

O MVP de Locação de Veículos propõe uma base sólida de backend, priorizando qualidade e boas práticas no desenvolvimento.  
Seu objetivo é **provar a viabilidade** técnica e funcional do produto, servindo como ponto inicial para futuras evoluções, como autenticação, relatórios e interface web.
