import { z } from "zod";

export const inscricaoSchema = z.object({
  candidatoId: z
    .number({ error: "O ID do candidato é obrigatório" })
    .int("O ID do candidato deve ser um número inteiro")
    .positive("O ID do candidato deve ser maior que zero")
    .meta({ example: 1 }),

  concursoId: z
    .number({ error: "O ID do concurso é obrigatório" })
    .int("O ID do concurso deve ser um número inteiro")
    .positive("O ID do concurso deve ser maior que zero")
    .meta({ example: 1 }),
});

export type InscricaoInput = z.infer<typeof inscricaoSchema>;

// Filtros opcionais da listagem (?candidatoId=1&concursoId=2)
export const inscricaoFiltroSchema = z.object({
  candidatoId: z.coerce.number().optional().meta({ example: 1 }),
  concursoId: z.coerce.number().optional().meta({ example: 1 }),
});

export type InscricaoFiltroInput = z.infer<typeof inscricaoFiltroSchema>;
