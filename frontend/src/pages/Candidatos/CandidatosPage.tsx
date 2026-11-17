
import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Table,
  TextInput,
  Title,
} from '@mantine/core'
import {
  criarCandidatoSchema,
  atualizarCandidatoSchema,
} from '@concursos/shared'
import { request } from '../../services/api'

type Candidato = {
  id: number
  nome: string
  cpf: string
  email: string
  telefone: string | null
}

const formularioVazio = {
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
}

export function CandidatosPage() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([])
  const [busca, setBusca] = useState('')
  const [aberto, setAberto] = useState(false)
  const [editando, setEditando] = useState<number | null>(null)
  const [formulario, setFormulario] = useState(formularioVazio)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function carregar() {
    try {
      const lista = await request<Candidato[]>('/candidatos')
      setCandidatos(lista)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar candidatos')
    }
  }

  useEffect(() => {
    void carregar()
  }, [])

  function novo() {
    setEditando(null)
    setFormulario({ ...formularioVazio })
    setErro('')
    setAberto(true)
  }

  function editar(candidato: Candidato) {
    setEditando(candidato.id)
    setFormulario({
      nome: candidato.nome,
      cpf: candidato.cpf,
      email: candidato.email,
      telefone: candidato.telefone ?? '',
    })
    setErro('')
    setAberto(true)
  }

  async function salvar() {
    setErro('')

    const dados = {
      nome: formulario.nome,
      cpf: formulario.cpf,
      email: formulario.email,
      telefone: formulario.telefone.trim() || null,
    }

    const resultado =
      editando === null
        ? criarCandidatoSchema.safeParse(dados)
        : atualizarCandidatoSchema.safeParse(dados)

    if (!resultado.success) {
      setErro(
        resultado.error.issues.map((item) => item.message).join('; '),
      )
      return
    }

    setSalvando(true)

    try {
      await request(
        editando === null ? '/candidatos' : `/candidatos/${editando}`,
        {
          method: editando === null ? 'POST' : 'PUT',
          body: JSON.stringify(resultado.data),
        },
      )

      setAberto(false)
      await carregar()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao salvar candidato')
    } finally {
      setSalvando(false)
    }
  }

  async function excluir(candidato: Candidato) {
    if (!window.confirm(`Excluir o candidato "${candidato.nome}"?`)) {
      return
    }

    setErro('')

    try {
      await request(`/candidatos/${candidato.id}`, {
        method: 'DELETE',
      })
      await carregar()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao excluir candidato')
    }
  }

  const filtrados = candidatos.filter((candidato) =>
    `${candidato.nome} ${candidato.cpf} ${candidato.email}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  )

  return (
    <Stack p="md">
      <Group justify="space-between">
        <Title order={2}>Candidatos</Title>
        <Button onClick={novo}>Novo candidato</Button>
      </Group>

      {!aberto && erro && <Alert color="red">{erro}</Alert>}

      <TextInput
        label="Pesquisar candidatos"
        placeholder="Nome, CPF ou e-mail"
        value={busca}
        onChange={(evento) => setBusca(evento.currentTarget.value)}
      />

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nome</Table.Th>
            <Table.Th>CPF</Table.Th>
            <Table.Th>E-mail</Table.Th>
            <Table.Th>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {filtrados.map((candidato) => (
            <Table.Tr key={candidato.id}>
              <Table.Td>{candidato.nome}</Table.Td>
              <Table.Td>{candidato.cpf}</Table.Td>
              <Table.Td>{candidato.email}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => editar(candidato)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="xs"
                    variant="light"
                    color="red"
                    onClick={() => void excluir(candidato)}
                  >
                    Excluir
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {filtrados.length === 0 && (
        <p>Nenhum candidato encontrado.</p>
      )}

      <Modal
        opened={aberto}
        onClose={() => setAberto(false)}
        title={editando === null ? 'Novo candidato' : 'Editar candidato'}
        centered
      >
        <form
          onSubmit={(evento) => {
            evento.preventDefault()
            void salvar()
          }}
        >
          <Stack>
            {erro && <Alert color="red">{erro}</Alert>}

            <TextInput
              label="Nome"
              required
              value={formulario.nome}
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  nome: evento.currentTarget.value,
                })
              }
            />

            <TextInput
              label="CPF (11 números)"
              required
              maxLength={11}
              value={formulario.cpf}
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  cpf: evento.currentTarget.value,
                })
              }
            />

            <TextInput
              label="E-mail"
              type="email"
              required
              value={formulario.email}
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  email: evento.currentTarget.value,
                })
              }
            />

            <TextInput
              label="Telefone (opcional)"
              value={formulario.telefone}
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  telefone: evento.currentTarget.value,
                })
              }
            />

            <Button type="submit" loading={salvando}>
              Salvar
            </Button>
          </Stack>
        </form>
      </Modal>
    </Stack>
  )
}
