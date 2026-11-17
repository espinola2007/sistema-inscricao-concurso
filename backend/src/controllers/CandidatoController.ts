
import type { Request, Response } from "express";
import * as service from "../services/candidatoService.js";
import { HttpError } from "../middlewares/errorHandler.js";

function idValido(valor: string | string[] | undefined): number {
  if (typeof valor !== "string" || !/^\d+$/.test(valor)) {
    throw new HttpError(400, "ID de candidato inválido.");
  }

  const id = Number(valor);

  if (!Number.isSafeInteger(id) || id < 1) {
    throw new HttpError(400, "ID de candidato inválido.");
  }

  return id;
}

export async function listar(_req: Request, res: Response) {
  return res.json(await service.listarCandidatos());
}

export async function buscarPorId(req: Request, res: Response) {
  return res.json(
    await service.buscarCandidato(idValido(req.params.id)),
  );
}

export async function cadastrar(req: Request, res: Response) {
  return res.status(201).json(
    await service.criarCandidato(req.body),
  );
}

export async function atualizar(req: Request, res: Response) {
  return res.json(
    await service.atualizarCandidato(
      idValido(req.params.id),
      req.body,
    ),
  );
}

export async function excluir(req: Request, res: Response) {
  await service.excluirCandidato(idValido(req.params.id));

  return res.status(204).send();
}

