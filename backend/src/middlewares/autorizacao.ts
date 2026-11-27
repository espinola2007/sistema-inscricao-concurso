import type { NextFunction, Request, Response } from "express";
import { validarToken } from "../config/token.js";

export function exigirAdmin(req: Request, res: Response, next: NextFunction) {
  const cabecalho = req.headers.authorization ?? "";
  const token = cabecalho.startsWith("Bearer ") ? cabecalho.slice(7) : "";
  const payload = token ? validarToken(token) : null;

  if (!payload) {
    return res.status(401).json({ mensagem: "Faça login para continuar" });
  }

  if (payload.isAdmin !== true) {
    return res.status(403).json({
      mensagem: "Apenas administradores podem realizar esta ação",
    });
  }

  return next();
}