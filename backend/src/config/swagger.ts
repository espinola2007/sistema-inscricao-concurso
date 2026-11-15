
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
  cadastroUsuarioSchema,
  loginUsuarioSchema,
  criarCandidatoSchema,
  atualizarCandidatoSchema,
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


registry.registerPath({
  method: "put",
  path: "/inscricoes/{id}",
  summary: "Atualiza uma inscrição",
  tags: ["Inscrições"],
  request: {
    params: parametrosId,
    body: json(inscricaoSchema),
  },
  responses: {
    200: resposta("Inscrição atualizada", Inscricao),
    400: resposta("Dados inválidos"),
    404: resposta("Inscrição, candidato ou concurso não encontrado"),
    409: resposta("Candidato já inscrito no concurso"),
    422: resposta("Concurso com inscrições encerradas"),
  },
});

registry.registerPath({
  method: "delete",
  path: "/inscricoes/{id}",
  summary: "Exclui uma inscrição",
  tags: ["Inscrições"],
  request: {
    params: parametrosId,
  },
  responses: {
    204: resposta("Inscrição excluída"),
    400: resposta("ID inválido"),
    404: resposta("Inscrição não encontrada"),
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

registry.registerPath({
  method: "post",
  path: "/login",
  summary: "Autentica um usuário",
  tags: ["Autenticação"],
  request: {
    body: json(loginUsuarioSchema),
  },
  responses: {
    200: resposta("Credenciais válidas"),
    400: resposta("Dados inválidos"),
    401: resposta("E-mail ou senha inválidos"),
  },
});

registry.registerPath({
  method: "post",
  path: "/usuarios",
  summary: "Cadastra um usuário",
  tags: ["Autenticação"],
  request: {
    body: json(cadastroUsuarioSchema),
  },
  responses: {
    201: resposta("Usuário cadastrado"),
    400: resposta("Dados inválidos"),
    409: resposta("E-mail já cadastrado"),
  },
});


 // --------------------------------------------------
 // CANDIDATOS
 // --------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/candidatos",
  summary: "Lista candidatos",
  tags: ["Candidatos"],
  responses: {
    200: resposta("Lista de candidatos retornada com sucesso"),
  },
});

registry.registerPath({
  method: "get",
  path: "/candidatos/{id}",
  summary: "Busca candidato por ID",
  tags: ["Candidatos"],
  request: {
    params: parametrosId,
  },
  responses: {
    200: resposta("Candidato encontrado"),
    400: resposta("ID inválido"),
    404: resposta("Candidato não encontrado"),
  },
});

registry.registerPath({
  method: "post",
  path: "/candidatos",
  summary: "Cadastra candidato",
  tags: ["Candidatos"],
  request: {
    body: json(criarCandidatoSchema),
  },
  responses: {
    201: resposta("Candidato cadastrado"),
    400: resposta("Dados inválidos"),
    409: resposta("CPF já cadastrado"),
  },
});

registry.registerPath({
  method: "put",
  path: "/candidatos/{id}",
  summary: "Atualiza candidato",
  tags: ["Candidatos"],
  request: {
    params: parametrosId,
    body: json(atualizarCandidatoSchema),
  },
  responses: {
    200: resposta("Candidato atualizado"),
    400: resposta("Dados inválidos"),
    404: resposta("Candidato não encontrado"),
    409: resposta("CPF já cadastrado"),
  },
});

registry.registerPath({
  method: "delete",
  path: "/candidatos/{id}",
  summary: "Exclui candidato",
  tags: ["Candidatos"],
  request: {
    params: parametrosId,
  },
  responses: {
    204: resposta("Candidato excluído"),
    400: resposta("ID inválido"),
    404: resposta("Candidato não encontrado"),
    409: resposta("Candidato possui inscrições vinculadas"),
  },
});


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
