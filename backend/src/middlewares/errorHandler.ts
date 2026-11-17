
import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

// Erros de regras de negócio: 400, 404, 409, 422...
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Erros de regras de negócio.
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      mensagem: err.message,
    });
  }

  // Dados inválidos segundo os schemas Zod.
  if (err instanceof ZodError) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      detalhes: err.issues,
    });
  }

  // JSON malformado recebido pelo Express.
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      mensagem: "JSON inválido. Verifique o corpo da requisição.",
    });
  }

  // Violação de campo único no banco de dados.
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    return res.status(409).json({
      mensagem: "Já existe um registro com esse valor único.",
    });
  }

  // Erros inesperados.
  console.error(err);

  return res.status(500).json({
    mensagem: "Erro interno do servidor",
  });
}
