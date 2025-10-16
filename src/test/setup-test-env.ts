import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { afterAll, afterEach } from "vitest";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { prisma } from "@/lib/prisma";

dotenv.config({ path: ".env.test" });

/**
 * Esta função é executada uma vez antes de toda a suíte de testes.
 * Ela cria um banco de dados MySQL único e temporário para garantir
 * o isolamento completo dos testes.
 */
async function setupTestDatabase() {
  const { DATABASE_URL } = process.env;

  if (!DATABASE_URL) {
    throw new Error("A variável de ambiente DATABASE_URL não foi definida.");
  }

  const dbName = `test_${randomUUID().replace(/-/g, "")}`;
  const url = new URL(DATABASE_URL);

  const connectionConfig = {
    host: url.hostname,
    port: Number(url.port),
    user: url.username,
    password: url.password,
  };

  const connection = await mysql.createConnection(connectionConfig);

  await connection.query(`CREATE DATABASE \`${dbName}\``);
  console.log(`Banco de dados de teste '${dbName}' criado.`);

  url.pathname = `/${dbName}`;
  process.env.DATABASE_URL = url.toString();

  console.log(`Aplicando migrations no banco de teste: 
    ${process.env.DATABASE_URL}`);
  execSync("npm run db:test-setup", { stdio: "inherit" });
  console.log("Migrations aplicadas com sucesso.");

  return { connection, dbName };
}

// Executa a função de setup e aguarda sua conclusão antes de prosseguir.
// O `await` no top-level garante que isso aconteça antes da importação dos testes.
const { connection, dbName } = await setupTestDatabase();

// Limpa o banco de dados após cada teste para garantir o isolamento.
// A ordem de deleção é importante para respeitar as chaves estrangeiras.
afterEach(async () => {
  await prisma.rental.deleteMany();
  await prisma.car.deleteMany();
  await prisma.client.deleteMany();
  await prisma.rentalPoint.deleteMany();
});

// Registra a função de limpeza que será executada após todos os testes.
afterAll(async () => {
  await connection.query(`DROP DATABASE \`${dbName}\``);
  await connection.end();
  console.log(`Banco de dados de teste '${dbName}' destruído.`);
});
