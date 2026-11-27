import { exigirAdmin } from "../middlewares/autorizacao.js";
import Router from "express";

import * as controller from "../controllers/ConcursoController.js";

import { validarBody } from "../middlewares/validarSchema.js";

import {
  criarConcursoSchema,
  atualizarConcursoSchema,
} from "@concursos/shared";

const router = Router();

router.get(
  "/concursos",
  controller.listar,
);

router.get(
  "/concursos/:id",
  controller.buscarPorId,
);

router.post(
  "/concursos",
  exigirAdmin,
  validarBody(criarConcursoSchema),
  controller.cadastrar,
);

router.put(
  "/concursos/:id",
  exigirAdmin,
  validarBody(atualizarConcursoSchema),
  controller.atualizar,
);

router.delete(
  "/concursos/:id",
  exigirAdmin,
  controller.excluir,
);

export default router;
