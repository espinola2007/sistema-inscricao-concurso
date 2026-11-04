import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

// Erro de regra de negócio com o status HTTP correto (404, 409, 422...)
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
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ mensagem: err.message });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({ mensagem: "Parâmetros inválidos", detalhes: err.issues });
  }
  console.error(err);
  return res.status(500).json({ mensagem: "Erro interno do servidor" });
}
