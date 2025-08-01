# Car Rental API

API RESTful para o sistema de aluguel de carros **Move On**.

## Visão Geral

Esta API é a espinha dorsal do sistema Move On, responsável por toda a lógica de negócio relacionada ao aluguel de veículos. Ela foi desenvolvida como parte do treinamento "Desenvolvimento Full Stack" e serve como trabalho de conclusão de curso.

### Funcionalidades Principais:

* **Gerenciamento de Frota:** CRUD completo para veículos, incluindo informações como modelo, marca, ano, placa e status.
* **Controle de Reservas:** Sistema para criar, consultar, atualizar e cancelar reservas.
* **Cálculo de Tarifas:** Lógica para calcular o valor do aluguel com base no período e tipo de veículo.
* **Histórico de Locações:** Registro de todas as locações passadas.
* **Registro de Multas:** Sistema para registrar multas e taxas adicionais.

## Tecnologias Utilizadas

(Aqui você listará as tecnologias que pretende usar no back-end, por exemplo: Node.js, Express.js, PostgreSQL, etc.)

## Como Rodar o Projeto

(Instruções de como configurar e executar a API localmente. Por exemplo: `npm install`, `npm start` ou `docker-compose up`.)

## Endpoints da API

Tabela com os principais endpoints, métodos HTTP e uma breve descrição. 
Exemplo:

| Método | Endpoint                | Descrição                      |
| :----- | :---------------------- | :----------------------------- |
| `GET`  | `/api/vehicles`         | Lista todos os veículos       |
| `POST` | `/api/rentals`          | Cria uma nova locação          |
| `PUT`  | `/api/rentals/{id}/return` | Finaliza uma locação         |
