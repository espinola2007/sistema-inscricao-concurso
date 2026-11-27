import { gerarToken } from "../config/token.js";
import type { Request, Response } from "express";
import { loginUsuarioSchema } from "@concursos/shared";
import { autenticar } from "../services/authService.js";


export async function login(req: Request, res: Response) {
  const validacao = loginUsuarioSchema.safeParse(req.body);

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
    token: gerarToken(usuario),
  });
  
}

import { cadastroUsuarioSchema } from "@concursos/shared";
import { cadastrar } from "../services/authService.js";

export async function cadastro(req: Request, res: Response) {
  const validacao = cadastroUsuarioSchema.safeParse(req.body);

  if (!validacao.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      detalhes: validacao.error.issues.map((erro) => ({
        campo: erro.path.join("."),
        mensagem: erro.message,
      })),
    });
  }

  const { nome, email, senha } = validacao.data;
  const usuario = await cadastrar(nome, email, senha);

  if (!usuario) {
    return res.status(409).json({
      mensagem: "Este e-mail já está cadastrado",
    });
  }

  return res.status(201).json(usuario);

}

