
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";

import { z } from "zod";

import {
  inscricaoSchema,
  inscricaoFiltroSchema,
} from "../schemas/inscricao.js";

import {
  criarConcursoSchema,
  atualizarConcursoSchema,
  criarCargoSchema,
  atualizarCargoSchema,
} from "@concursos/shared";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

const json = (schema: z.ZodType) => ({
  content: {
    "application/json": { schema },
  },
});

const resposta = (description: string, schema?: z.ZodType) => ({
  description,
  ...(schema ? json(schema) : {}),
});

const parametrosId = z.object({
  id: z.coerce.number().int().positive(),
});

// --------------------------------------------------
// INSCRIÇÕES — Documentação existente de Anny
// --------------------------------------------------

const Inscricao = registry.register(
  "Inscricao",
  inscricaoSchema.extend({
    id: z.number().openapi({ example: 1 }),
    data: z.string().openapi({
      example: "2026-11-04T11:00:00.000Z",
    }),
    status: z.string().openapi({ example: "CONFIRMADA" }),
  }),
);

registry.registerPath({
  method: "get",
  path: "/inscricoes",
  summary: "Lista inscrições (filtros opcionais por candidato e concurso)",
  tags: ["Inscrições"],
  request: { query: inscricaoFiltroSchema },
  responses: {
    200: resposta("Lista retornada com sucesso", z.array(Inscricao)),
  },
});

registry.registerPath({
  method: "get",
  path: "/inscricoes/{id}",
  summary: "Busca inscrição por ID",
  tags: ["Inscrições"],
  request: {
    params: z.object({
      id: z.coerce.number().openapi({ example: 1 }),
    }),
  },
  responses: {
    200: resposta("Inscrição encontrada", Inscricao),
    404: resposta("Não encontrada"),
  },
});

registry.registerPath({
  method: "post",
  path: "/inscricoes",
  summary: "Registra uma inscrição",
  tags: ["Inscrições"],
  request: {
    body: json(inscricaoSchema),
  },
  responses: {
    201: resposta("Inscrição registrada", Inscricao),
    400: resposta("Erro de validação"),
    404: resposta("Candidato ou concurso não encontrado"),
    409: resposta("Candidato já inscrito neste concurso"),
    422: resposta("Concurso com inscrições encerradas"),
  },
});

// --------------------------------------------------
// CONCURSOS
// --------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/concursos",
  summary: "Lista concursos",
  tags: ["Concursos"],
  responses: {
    200: resposta("Lista de concursos retornada com sucesso"),
  },
});

registry.registerPath({
  method: "get",
  path: "/concursos/{id}",
  summary: "Busca concurso por ID",
  tags: ["Concursos"],
  request: {
    params: parametrosId,
  },
  responses: {
    200: resposta("Concurso encontrado"),
    404: resposta("Concurso não encontrado"),
  },
});

registry.registerPath({
  method: "post",
  path: "/concursos",
  summary: "Cadastra concurso",
  tags: ["Concursos"],
  request: {
    body: json(criarConcursoSchema),
  },
  responses: {
    201: resposta("Concurso cadastrado"),
    400: resposta("Dados inválidos"),
  },
});

registry.registerPath({
  method: "put",
  path: "/concursos/{id}",
  summary: "Atualiza concurso",
  tags: ["Concursos"],
  request: {
    params: parametrosId,
    body: json(atualizarConcursoSchema),
  },
  responses: {
    200: resposta("Concurso atualizado"),
    400: resposta("Dados inválidos"),
    404: resposta("Concurso não encontrado"),
  },
});

registry.registerPath({
  method: "delete",
  path: "/concursos/{id}",
  summary: "Exclui concurso",
  tags: ["Concursos"],
  request: {
    params: parametrosId,
  },
  responses: {
    204: resposta("Concurso excluído"),
    404: resposta("Concurso não encontrado"),
    409: resposta("Concurso possui inscrições vinculadas"),
  },
});

// --------------------------------------------------
// CARGOS
// --------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/cargos",
  summary: "Lista cargos",
  tags: ["Cargos"],
  responses: {
    200: resposta("Lista de cargos retornada com sucesso"),
  },
});

registry.registerPath({
  method: "get",
  path: "/cargos/{id}",
  summary: "Busca cargo por ID",
  tags: ["Cargos"],
  request: {
    params: parametrosId,
  },
  responses: {
    200: resposta("Cargo encontrado"),
    404: resposta("Cargo não encontrado"),
  },
});

registry.registerPath({
  method: "post",
  path: "/cargos",
  summary: "Cadastra cargo",
  tags: ["Cargos"],
  request: {
    body: json(criarCargoSchema),
  },
  responses: {
    201: resposta("Cargo cadastrado"),
    400: resposta("Dados inválidos"),
    404: resposta("Concurso não encontrado"),
  },
});

registry.registerPath({
  method: "put",
  path: "/cargos/{id}",
  summary: "Atualiza cargo",
  tags: ["Cargos"],
  request: {
    params: parametrosId,
    body: json(atualizarCargoSchema),
  },
  responses: {
    200: resposta("Cargo atualizado"),
    400: resposta("Dados inválidos"),
    404: resposta("Cargo ou concurso não encontrado"),
  },
});

registry.registerPath({
  method: "delete",
  path: "/cargos/{id}",
  summary: "Exclui cargo",
  tags: ["Cargos"],
  request: {
    params: parametrosId,
  },
  responses: {
    204: resposta("Cargo excluído"),
    404: resposta("Cargo não encontrado"),
  },
});

// --------------------------------------------------
// GERAÇÃO DO DOCUMENTO SWAGGER
// --------------------------------------------------

const generator = new OpenApiGeneratorV3(registry.definitions);

export const swaggerSpec = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "API Concursos Públicos",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor Local",
    },
  ],
});
