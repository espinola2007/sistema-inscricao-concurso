// Listagens usadas só para preencher os <Select> do formulário de inscrição.
// Depende de GET /candidatos e GET /concursos (módulos da Evelyn e da Maria Vitória).
// Se elas tiverem serviços próprios, troque por eles.
import { request } from './api.ts'

export interface CandidatoOpcao {
  id: number
  nome: string
  cpf: string
}

export interface ConcursoOpcao {
  id: number
  nome: string
  orgao: string
  status: string
  dataAbertura: string
  dataEncerramento: string
}

export const opcoesService = {
  candidatos: () => request<CandidatoOpcao[]>('/candidatos'),
  concursos: () => request<ConcursoOpcao[]>('/concursos'),
}
