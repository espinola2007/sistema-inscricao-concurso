import { test } from "node:test";
import assert from "node:assert/strict";
import {
  criarCandidatoSchema,
  atualizarCandidatoSchema,
} from "@concursos/shared";

test("aceita candidato com CPF válido", () => {
  const resultado = criarCandidatoSchema.safeParse({
    nome: "Maria da Silva",
    cpf: "52998224725",
    email: "maria@email.com",
  });

  assert.equal(resultado.success, true);
});

test("rejeita CPF com dígitos verificadores inválidos", () => {
  const resultado = criarCandidatoSchema.safeParse({
    nome: "Maria da Silva",
    cpf: "52998224724",
    email: "maria@email.com",
  });

  assert.equal(resultado.success, false);
});

test("rejeita CPF com números repetidos", () => {
  const resultado = criarCandidatoSchema.safeParse({
    nome: "Maria da Silva",
    cpf: "11111111111",
    email: "maria@email.com",
  });

  assert.equal(resultado.success, false);
});

test("rejeita CPF com quantidade incorreta de números", () => {
  const resultado = criarCandidatoSchema.safeParse({
    nome: "Maria da Silva",
    cpf: "123456789",
    email: "maria@email.com",
  });

  assert.equal(resultado.success, false);
});

test("rejeita e-mail inválido", () => {
  const resultado = criarCandidatoSchema.safeParse({
    nome: "Maria da Silva",
    cpf: "52998224725",
    email: "email-invalido",
  });

  assert.equal(resultado.success, false);
});

test("rejeita atualização sem nenhum campo", () => {
  const resultado = atualizarCandidatoSchema.safeParse({});

  assert.equal(resultado.success, false);
});

test("aceita atualização parcial válida", () => {
  const resultado = atualizarCandidatoSchema.safeParse({
    nome: "Maria Silva",
  });

  assert.equal(resultado.success, true);
});
