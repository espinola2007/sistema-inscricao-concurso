// Cliente HTTP único. A T pode evoluir este arquivo (loading, token etc.).
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const resposta = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => ({}))
    const detalhes = Array.isArray(corpo.detalhes)
      ? ': ' + corpo.detalhes.map((d: { mensagem: string }) => d.mensagem).join('; ')
      : ''
    throw new ApiError(resposta.status, (corpo.mensagem ?? 'Erro inesperado') + detalhes)
  }
  return resposta.status === 204 ? (undefined as T) : resposta.json()
}
