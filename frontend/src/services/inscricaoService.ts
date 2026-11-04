import { request } from './api.ts'

export interface Inscricao {
  id: number
  candidatoId: number
  concursoId: number
  data: string
  status: string
  candidato: { id: number; nome: string; cpf: string; email: string }
  concurso: { id: number; nome: string; orgao: string }
}

export interface InscricaoInput {
  candidatoId: number
  concursoId: number
}

export const inscricaoService = {
  listar: (filtro: { candidatoId?: number; concursoId?: number } = {}) => {
    const params = new URLSearchParams()
    if (filtro.candidatoId) params.set('candidatoId', String(filtro.candidatoId))
    if (filtro.concursoId) params.set('concursoId', String(filtro.concursoId))
    const qs = params.toString()
    return request<Inscricao[]>(`/inscricoes${qs ? `?${qs}` : ''}`)
  },
  buscarPorId: (id: number) => request<Inscricao>(`/inscricoes/${id}`),
  criar: (dados: InscricaoInput) =>
    request<Inscricao>('/inscricoes', { method: 'POST', body: JSON.stringify(dados) }),
}
