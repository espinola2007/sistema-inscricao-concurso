// Listagens usadas para preencher os <Select> do formulário de inscrição
// (GET /candidatos e GET /concursos).
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
