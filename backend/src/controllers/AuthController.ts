
import type { Request, Response } from "express";
import { z } from "zod";
import { autenticar } from "../services/authService.js";

const loginSchema = z.object({
  email: z.email(),
  senha: z.string().min(1),
});

export async function login(req: Request, res: Response) {
  const validacao = loginSchema.safeParse(req.body);

  if (!validacao.success) {
    return res.status(400).json({
      mensagem: "Informe um e-mail e uma senha válidos",
    });
  }

  const { email, senha } = validacao.data;
  const usuario = await autenticar(email, senha);

  if (!usuario) {
    return res.status(401).json({
      mensagem: "E-mail ou senha inválidos",
    });
  }

  return res.status(200).json({
    mensagem: "Credenciais válidas",
    usuario,
  });
}
