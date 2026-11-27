import { createHmac, timingSafeEqual } from "node:crypto";

import "dotenv/config";
import { randomBytes } from "node:crypto";

const SEGREDO = process.env.AUTH_SECRET || randomBytes(32).toString("hex");
const DURACAO_MS = 8 * 60 * 60 * 1000; // 8 horas

export type PayloadToken = {
  id: number;
  isAdmin: boolean;
  exp: number;
};

function assinar(dados: string) {
  return createHmac("sha256", SEGREDO).update(dados).digest("base64url");
}

export function gerarToken(usuario: { id: number; isAdmin: boolean }) {
  const payload: PayloadToken = {
    id: usuario.id,
    isAdmin: usuario.isAdmin,
    exp: Date.now() + DURACAO_MS,
  };
  const corpo = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${corpo}.${assinar(corpo)}`;
}

export function validarToken(token: string): PayloadToken | null {
  const [corpo, assinatura, extra] = token.split(".");
  if (extra !== undefined) return null;
  if (!corpo || !assinatura) return null;

  const esperada = Buffer.from(assinar(corpo));
  const recebida = Buffer.from(assinatura);
  if (esperada.length !== recebida.length || !timingSafeEqual(esperada, recebida)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(corpo, "base64url").toString()) as PayloadToken;
    if (!Number.isSafeInteger(payload.id) || typeof payload.isAdmin !== "boolean" || !Number.isFinite(payload.exp) || payload.exp <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}