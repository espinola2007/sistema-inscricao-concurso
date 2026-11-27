
import axios, { AxiosError } from 'axios'
import type { Method } from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function definirToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`
  else delete api.defaults.headers.common.Authorization
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function request<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  try {
    const resposta = await api.request<T>({
      url: path,
      method: (init?.method ?? 'GET') as Method,
      data: init?.body,
      headers: init?.headers as Record<string, string> | undefined,
    })

    return resposta.status === 204 ? (undefined as T) : resposta.data
  } catch (erro) {
    if (erro instanceof AxiosError && erro.response) {
      const corpo = erro.response.data
      const detalhes = Array.isArray(corpo?.detalhes)
        ? ': ' + corpo.detalhes
            .map(
              (d: { mensagem?: string; message?: string }) =>
                d.mensagem ?? d.message,
            )
            .join('; ')
        : ''

      throw new ApiError(
        erro.response.status,
        (corpo?.mensagem ?? 'Erro inesperado') + detalhes
      )
    }

    throw erro
  }
}

export default api
