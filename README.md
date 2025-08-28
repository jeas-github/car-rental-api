# Car Rental API

API RESTful para o sistema de aluguel de carros **Move On**.

## Principais Tecnologias

- **Node.js**: Ambiente de execução JavaScript/TypeScript.
- **TypeScript**: Tipagem estática para maior segurança e produtividade.
- **Fastify**: Framework web rápido e eficiente para APIs.
- **Prisma**: ORM moderno para gerenciamento do banco de dados MySQL.
- **MySQL**: Banco de dados relacional utilizado pela aplicação.
- **Zod**: Validação de dados e schemas.
- **ESLint**: Padronização e análise de código.

## Pré-requisitos

- Node.js >= 18
- MySQL >= 8
- npm ou yarn

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/jeas-github/car-rental-api.git
   cd car-rental-api
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o banco de dados:**
   - Crie um banco MySQL chamado `car-rental`.
   - Edite o arquivo `.env` com suas credenciais:
     ```
     DATABASE_URL="mysql://usuario:senha@localhost:3306/car-rental"
     ```

4. **Execute as migrations do Prisma:**
   ```bash
   npx prisma migrate dev
   ```

5. **(Opcional) Abra o Prisma Studio para visualizar os dados:**
   ```bash
   npx prisma studio
   ```

## Principais Comandos

- **Subir o servidor em modo desenvolvimento:**
  ```bash
  npm run start:dev
  ```

- **Rodar migrations do banco:**
  ```bash
  npx prisma migrate dev
  ```

- **Gerar o Prisma Client (após alterar o schema):**
  ```bash
  npx prisma generate
  ```

- **Padronizar e corrigir o código:**
  ```bash
  npm run lint:fix
  ```

## Estrutura do Projeto

```
src/
  routes/         # Rotas da API (ex: cars.ts)
  entities/       # Modelos de dados (se necessário)
  server.ts       # Inicialização do servidor Fastify
prisma/
  schema.prisma   # Modelos e configuração do Prisma
  migrations/     # Histórico das migrations
.env              # Variáveis de ambiente
```

## Observações

- O Prisma Client é gerado automaticamente em `node_modules/@prisma/client`.
- Não é necessário versionar arquivos gerados pelo Prisma.
- Para adicionar novos modelos, edite o `schema.prisma` e rode os comandos de migration e generate.

## Licença

Este projeto está sob a licença ISC.
