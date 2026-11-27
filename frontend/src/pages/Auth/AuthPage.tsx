
import { useState } from 'react'
import {
  Alert,
  Button,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import {
  cadastroUsuarioSchema,
  loginUsuarioSchema,
} from '@concursos/shared'
import { request, definirToken } from '../../services/api'

type Usuario = {
  id: number
  nome: string
  email: string
  isAdmin: boolean
}

type RespostaLogin = {
  mensagem: string
  usuario: Usuario
  token: string
}

type AuthPageProps = {
  onLogin: (usuario: Usuario) => void
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  function alterarModo() {
    setModo(modo === 'login' ? 'cadastro' : 'login')
    setErro('')
    setSucesso('')
  }

  async function enviar() {
    setErro('')
    setSucesso('')

    const resultado =
      modo === 'cadastro'
        ? cadastroUsuarioSchema.safeParse({ nome, email, senha })
        : loginUsuarioSchema.safeParse({ email, senha })

    if (!resultado.success) {
      setErro(resultado.error.issues.map((item) => item.message).join('; '))
      return
    }

    setCarregando(true)

    try {
      if (modo === 'cadastro') {
        await request<Usuario>('/usuarios', {
          method: 'POST',
          body: JSON.stringify({ nome, email, senha }),
        })

        setSucesso('Cadastro realizado! Faça login para continuar.')
        setModo('login')
        setSenha('')
      } else {
        const resposta = await request<RespostaLogin>('/login', {
          method: 'POST',
          body: JSON.stringify({ email, senha }),
        })

        definirToken(resposta.token)
        onLogin(resposta.usuario)
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao comunicar com a API')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Paper withBorder shadow="sm" radius="md" p="xl" maw={440} mx="auto" mt="xl">
      <form
        onSubmit={(evento) => {
          evento.preventDefault()
          void enviar()
        }}
      >
        <Stack>
          <Title order={2} ta="center">
            {modo === 'login' ? 'Entrar no sistema' : 'Criar conta'}
          </Title>

          {erro && <Alert color="red">{erro}</Alert>}
          {sucesso && <Alert color="green">{sucesso}</Alert>}

          {modo === 'cadastro' && (
            <TextInput
              label="Nome completo"
              required
              value={nome}
              onChange={(evento) => setNome(evento.currentTarget.value)}
            />
          )}

          <TextInput
            label="E-mail"
            type="email"
            required
            value={email}
            onChange={(evento) => setEmail(evento.currentTarget.value)}
          />

          <PasswordInput
            label="Senha"
            required
            value={senha}
            onChange={(evento) => setSenha(evento.currentTarget.value)}
          />

          <Button type="submit" loading={carregando} fullWidth>
            {modo === 'login' ? 'Entrar' : 'Cadastrar'}
          </Button>

          <Button variant="subtle" onClick={alterarModo}>
            {modo === 'login'
              ? 'Não tem conta? Cadastre-se'
              : 'Já tem conta? Faça login'}
          </Button>
        </Stack>
      </form>
    </Paper>
  )
}
