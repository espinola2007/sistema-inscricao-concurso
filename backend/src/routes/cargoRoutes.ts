
import { Router } from "express";

import * as controller from "../controllers/CargoController.js";

import { validarBody } from "../middlewares/validarSchema.js";

import {
  criarCargoSchema,
  atualizarCargoSchema,
} from "../schemas/cargo.js";

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
  validarBody(criarCargoSchema),
  controller.cadastrar,
);

router.put(
  "/cargos/:id",
  validarBody(atualizarCargoSchema),
  controller.atualizar,
);

router.delete(
  "/cargos/:id",
  controller.excluir,
);

export default router;
