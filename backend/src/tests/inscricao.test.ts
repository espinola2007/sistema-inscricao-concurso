// Teste de integração: precisa do Postgres no ar e das tabelas criadas
// (npx prisma migrate dev). Rodar: npm test
process.env.NODE_ENV = "test";

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { app } from "../server.js";
import { prisma } from "../config/prisma.js";

let server: Server;
let base: string;
let candidatoId: number;
let abertoId: number;
let encerradoId: number;
let foraDoPrazoId: number;

const dia = 24 * 60 * 60 * 1000;
const post = (body: unknown) =>
  fetch(`${base}/inscricoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

before(async () => {
  await prisma.inscricao.deleteMany();
  await prisma.candidato.deleteMany({ where: { cpf: "00000000001" } });
  await prisma.concurso.deleteMany({ where: { orgao: "TESTE" } });

  const candidato = await prisma.candidato.create({
    data: { nome: "Candidata Teste", cpf: "00000000001", email: "t@t.com" },
  });
  const mk = (nome: string, status: string, ini: number, fim: number) =>
    prisma.concurso.create({
      data: {
        nome, orgao: "TESTE", descricao: "x", status,
        dataAbertura: new Date(Date.now() + ini * dia),
        dataEncerramento: new Date(Date.now() + fim * dia),
      },
    });
  candidatoId = candidato.id;
  abertoId = (await mk("Aberto", "ABERTO", -5, 5)).id;
  encerradoId = (await mk("Encerrado", "ENCERRADO", -10, -1)).id;
  foraDoPrazoId = (await mk("Status aberto, prazo vencido", "ABERTO", -10, -1)).id;

  server = app.listen(0);
  base = `http://localhost:${(server.address() as AddressInfo).port}`;
});

after(async () => {
  await prisma.inscricao.deleteMany();
  await prisma.concurso.deleteMany({ where: { orgao: "TESTE" } });
  await prisma.candidato.deleteMany({ where: { cpf: "00000000001" } });
  server.close();
  await prisma.$disconnect();
});

test("cria inscrição válida (201)", async () => {
  const r = await post({ candidatoId, concursoId: abertoId });
  assert.equal(r.status, 201);
  const corpo: any = await r.json();
  assert.equal(corpo.status, "CONFIRMADA");
  assert.equal(corpo.concurso.nome, "Aberto");
});

test("impede inscrição duplicada (409)", async () => {
  const r = await post({ candidatoId, concursoId: abertoId });
  assert.equal(r.status, 409);
});

test("impede inscrição em concurso encerrado (422)", async () => {
  assert.equal((await post({ candidatoId, concursoId: encerradoId })).status, 422);
});

test("impede inscrição fora do prazo mesmo com status ABERTO (422)", async () => {
  assert.equal((await post({ candidatoId, concursoId: foraDoPrazoId })).status, 422);
});

test("candidato inexistente (404)", async () => {
  assert.equal((await post({ candidatoId: 999999, concursoId: abertoId })).status, 404);
});

test("concurso inexistente (404)", async () => {
  assert.equal((await post({ candidatoId, concursoId: 999999 })).status, 404);
});

test("corpo inválido (400 com detalhes)", async () => {
  const r = await post({ candidatoId: -1 });
  assert.equal(r.status, 400);
  const corpo: any = await r.json();
  assert.ok(corpo.detalhes.length >= 2);
});

test("lista, filtra e busca por ID", async () => {
  const lista: any[] = await (await fetch(`${base}/inscricoes`)).json();
  assert.equal(lista.length, 1);
  const filtrada: any[] = await (await fetch(`${base}/inscricoes?concursoId=${encerradoId}`)).json();
  assert.equal(filtrada.length, 0);
  const um = await fetch(`${base}/inscricoes/${lista[0].id}`);
  assert.equal(um.status, 200);
  assert.equal((await fetch(`${base}/inscricoes/999999`)).status, 404);
});
