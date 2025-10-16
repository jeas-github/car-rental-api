import { expect, test, describe, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";

describe("Rotas de Pontos de Locação (E2E)", () => {
  // Prepara o servidor antes de todos os testes neste describe block
  beforeAll(async () => {
    await app.ready();
  });

  // Fecha o servidor depois de todos os testes neste describe block
  afterAll(async () => {
    await app.close();
  });

  test("Deve ser capaz de criar e buscar um ponto de locação", async () => {
    // 1. Tenta listar os pontos (deve estar vazio no início de cada teste)
    const listResponseEmpty = await request(app.server).get(
      "/api/rental-points",
    );

    expect(listResponseEmpty.status).toBe(200);
    expect(listResponseEmpty.body).toEqual([]);

    // 2. Cria um novo ponto de locação
    const createResponse = await request(app.server)
      .post("/api/rental-points")
      .send({
        name: "Aeroporto de Guarulhos",
        status: "ativo",
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty("pointId");
    const pointId = createResponse.body.pointId;

    // 3. Busca o ponto de locação específico pelo ID
    const getByIdResponse = await request(app.server).get(
      `/api/rental-points/${pointId}`,
    );

    expect(getByIdResponse.status).toBe(200);
    expect(getByIdResponse.body).toEqual(
      expect.objectContaining({
        pointId: pointId,
        name: "Aeroporto de Guarulhos",
        status: "ativo",
      }),
    );

    // 4. Lista todos os pontos novamente (deve conter o item criado)
    const listResponseFull = await request(app.server).get("/api/rental-points");
    expect(listResponseFull.status).toBe(200);
    expect(listResponseFull.body).toHaveLength(1);
    expect(listResponseFull.body[0].name).toBe("Aeroporto de Guarulhos");
  });

  test("Deve retornar 404 ao buscar um ponto de locação inexistente", async () => {
    const response = await request(app.server).get(
      `/api/rental-points/${crypto.randomUUID()}`,
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Ponto de aluguel não encontrado.",
    });
  });

  test("Deve ser capaz de deletar um ponto de locação", async () => {
    // 1. Cria um novo ponto de locação
    const createResponse = await request(app.server)
      .post("/api/rental-points")
      .send({
        name: "Ponto a ser deletado",
        status: "ativo",
      });

    expect(createResponse.status).toBe(201);
    const pointId = createResponse.body.pointId;

    // 2. Deleta o ponto de locação criado
    const deleteResponse = await request(app.server).delete(
      `/api/rental-points/${pointId}`,
    );

    expect(deleteResponse.status).toBe(204);

    // 3. Tenta buscar o ponto deletado (deve retornar 404)
    const getByIdResponse = await request(app.server).get(
      `/api/rental-points/${pointId}`,
    );

    expect(getByIdResponse.status).toBe(404);
    expect(getByIdResponse.body).toEqual({ message: "Ponto de aluguel não encontrado." });
  });

  // Teste adicional para garantir que a listagem funcione após várias operações
  test("Deve listar corretamente após várias operações", async () => {
    // Cria múltiplos pontos de locação
    const pointsToCreate = [
      { name: "Ponto A", status: "ativo" },
      { name: "Ponto B", status: "inativo" },
      { name: "Ponto C", status: "ativo" },
    ];

    for (const point of pointsToCreate) {
      const res = await request(app.server)
        .post("/api/rental-points")
        .send(point);
      expect(res.status).toBe(201);
    }

    // Lista todos os pontos e verifica se todos foram criados
    const listResponse = await request(app.server).get("/api/rental-points");

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(pointsToCreate.length);

    const names = listResponse.body.map((p: any) => p.name);
    for (const point of pointsToCreate) {
      expect(names).toContain(point.name);
    }
  });

  test("Deve retornar 404 ao tentar deletar um ponto de locação inexistente", async () => {
    const response = await request(app.server).delete(
      `/api/rental-points/${crypto.randomUUID()}`,
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Ponto de aluguel não encontrado.",
    });
  });

});
