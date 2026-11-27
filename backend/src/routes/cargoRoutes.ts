import { Router } from "express";

import * as controller from "../controllers/CargoController.js";

import { validarBody } from "../middlewares/validarSchema.js";
import { exigirAdmin } from "../middlewares/autorizacao.js";

import {
  criarCargoSchema,
  atualizarCargoSchema,
} from "@concursos/shared";

const router = Router();

router.get(
  "/cargos",
  controller.listar,
);

router.get(
  "/cargos/:id",
  controller.buscarPorId,
);

router.post(
  "/cargos",
  exigirAdmin,
  validarBody(criarCargoSchema),
  controller.cadastrar,
);

router.put(
  "/cargos/:id",
  exigirAdmin,
  validarBody(atualizarCargoSchema),
  controller.atualizar,
);

router.delete(
  "/cargos/:id",
  exigirAdmin,
  controller.excluir,
);

export default router;