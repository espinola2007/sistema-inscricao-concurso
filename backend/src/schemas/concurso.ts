
import { z } from "zod";

const campos = z.object({
  nome: z.string().trim().min(1, "Nome obrigatório"),
  orgao: z.string().trim().min(1, "Órgão obrigatório"),
  descricao: z.string().trim().min(1, "Descrição obrigatória"),
  dataAbertura: z.iso.datetime({ offset: true }),
  dataEncerramento: z.iso.datetime({ offset: true }),
  status: z.enum(["ABERTO", "ENCERRADO"]),
});

const conferirDatas = (dados: {
  dataAbertura: string;
  dataEncerramento: string;
}) =>
  new Date(dados.dataEncerramento).getTime() >
  new Date(dados.dataAbertura).getTime();

export const criarConcursoSchema = campos.refine(conferirDatas, {
  path: ["dataEncerramento"],
  message: "Encerramento deve ocorrer depois da abertura",
});

export const atualizarConcursoSchema = campos.partial().refine(
  (dados) => Object.keys(dados).length > 0,
  { message: "Informe ao menos um campo para atualizar" },
);

export type CriarConcursoInput = z.infer<typeof criarConcursoSchema>;

export type AtualizarConcursoInput = z.infer<
  typeof atualizarConcursoSchema
>;
