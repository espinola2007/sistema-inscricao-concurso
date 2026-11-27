import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Request, Response } from 'express';
import { exigirAdmin } from '../middlewares/autorizacao.js';
import { gerarToken } from '../config/token.js';

for (const [nome, token, esperado] of [
  ['visitante', '', 401],
  ['usuario comum', gerarToken({ id: 1, isAdmin: false }), 403],
  ['administrador', gerarToken({ id: 2, isAdmin: true }), 200],
  ['token adulterado', gerarToken({ id: 2, isAdmin: true }) + 'x', 401],
] as const) {
  test(`autorizacao: ${nome}`, () => {
    let status = 200;
    let passou = false;
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    const res = { status(n: number) { status = n; return this; }, json() { return this; } } as unknown as Response;
    exigirAdmin(req, res, () => { passou = true; });
    assert.equal(status, esperado);
    assert.equal(passou, esperado === 200);
  });
}
