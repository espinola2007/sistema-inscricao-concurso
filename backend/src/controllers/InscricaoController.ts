import type { Request, Response } from "express";
import * as service from "../services/inscricaoService.js";
import { inscricaoFiltroSchema } from "../schemas/inscricao.js";

export async function listar(req: Request, res: Response) {
  const filtro = inscricaoFiltroSchema.parse(req.query);
  const inscricoes = await service.listarInscricoes(filtro);
  return res.json(inscricoes);
}

export async function buscarPorId(req: Request, res: Response) {
  const id = Number(req.params.id);
  const inscricao = await service.encontrarUmaInscricao(id);
  if (!inscricao) {
    return res.status(404).json({ mensagem: "Inscrição não encontrada" });
  }
  return res.json(inscricao);
}

export async function cadastrar(req: Request, res: Response) {
  const inscricao = await service.criarInscricao(req.body);
  return res.status(201).json(inscricao);
}
