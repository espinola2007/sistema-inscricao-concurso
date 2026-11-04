import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { inscricaoSchema, inscricaoFiltroSchema } from "../schemas/inscricao.js";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

const json = (schema: z.ZodType) => ({ content: { "application/json": { schema } } });
const resposta = (description: string, schema?: z.ZodType) => ({
  description,
  ...(schema ? json(schema) : {}),
});

const Inscricao = registry.register(
  "Inscricao",
  inscricaoSchema.extend({
    id: z.number().openapi({ example: 1 }),
    data: z.string().openapi({ example: "2026-11-04T11:00:00.000Z" }),
    status: z.string().openapi({ example: "CONFIRMADA" }),
  }),
);

registry.registerPath({
  method: "get",
  path: "/inscricoes",
  summary: "Lista inscrições (filtros opcionais por candidato e concurso)",
  tags: ["Inscrições"],
  request: { query: inscricaoFiltroSchema },
  responses: { 200: resposta("Lista retornada com sucesso", z.array(Inscricao)) },
});

registry.registerPath({
  method: "get",
  path: "/inscricoes/{id}",
  summary: "Busca inscrição por ID",
  tags: ["Inscrições"],
  request: { params: z.object({ id: z.coerce.number().openapi({ example: 1 }) }) },
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
  request: { body: json(inscricaoSchema) },
  responses: {
    201: resposta("Inscrição registrada", Inscricao),
    400: resposta("Erro de validação"),
    404: resposta("Candidato ou concurso não encontrado"),
    409: resposta("Candidato já inscrito neste concurso"),
    422: resposta("Concurso com inscrições encerradas"),
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const swaggerSpec = generator.generateDocument({
  openapi: "3.0.0",
  info: { title: "API Concursos Públicos", version: "1.0.0" },
  servers: [{ url: "http://localhost:3000", description: "Servidor Local" }],
});
