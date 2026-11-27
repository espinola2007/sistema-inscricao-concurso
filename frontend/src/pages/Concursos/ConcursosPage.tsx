
import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Table,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import {
  criarConcursoSchema,
  atualizarConcursoSchema,
} from '@concursos/shared'
import { request } from '../../services/api'

type Concurso = {
  id: number
  nome: string
  orgao: string
  descricao: string
  dataAbertura: string
  dataEncerramento: string
  status: 'ABERTO' | 'ENCERRADO'
}

const formularioVazio = {
  nome: '',
  orgao: '',
  descricao: '',
  dataAbertura: '',
  dataEncerramento: '',
  status: 'ABERTO' as 'ABERTO' | 'ENCERRADO',
}

export function ConcursosPage({ isAdmin }: { isAdmin: boolean }) {
  const [concursos, setConcursos] = useState<Concurso[]>([])
  const [busca, setBusca] = useState('')
  const [aberto, setAberto] = useState(false)
  const [editando, setEditando] = useState<number | null>(null)
  const [formulario, setFormulario] = useState(formularioVazio)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function carregar() {
    try {
      setConcursos(await request<Concurso[]>('/concursos'))
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao listar concursos')
    }
  }

  useEffect(() => {
    void carregar()
  }, [])

  function novo() {
    if (!isAdmin) return
    setEditando(null)
    setFormulario({ ...formularioVazio })
    setErro('')
    setAberto(true)
  }

  function editar(concurso: Concurso) {
    if (!isAdmin) return
    setEditando(concurso.id)
    setFormulario({
      nome: concurso.nome,
      orgao: concurso.orgao,
      descricao: concurso.descricao,
      dataAbertura: concurso.dataAbertura.slice(0, 10),
      dataEncerramento: concurso.dataEncerramento.slice(0, 10),
      status: concurso.status,
    })
    setErro('')
    setAberto(true)
  }

  async function salvar() {
    if (!isAdmin) return
    setErro('')

    const dados = {
      ...formulario,
      dataAbertura: formulario.dataAbertura
        ? new Date(formulario.dataAbertura + 'T00:00:00Z').toISOString()
        : '',
      dataEncerramento: formulario.dataEncerramento
        ? new Date(formulario.dataEncerramento + 'T23:59:59Z').toISOString()
        : '',
    }

    const resultado = editando === null
      ? criarConcursoSchema.safeParse(dados)
      : atualizarConcursoSchema.safeParse(dados)

    if (!resultado.success) {
      setErro(resultado.error.issues.map((item) => item.message).join('; '))
      return
    }

    setCarregando(true)

    try {
      await request(
        editando === null ? '/concursos' : `/concursos/${editando}`,
        {
          method: editando === null ? 'POST' : 'PUT',
          body: JSON.stringify(resultado.data),
        },
      )

      setAberto(false)
      await carregar()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao salvar concurso')
    } finally {
      setCarregando(false)
    }
  }

  async function excluir(concurso: Concurso) {
    if (!isAdmin) return
    if (!window.confirm(`Excluir o concurso "${concurso.nome}"?`)) return

    setErro('')

    try {
      await request(`/concursos/${concurso.id}`, { method: 'DELETE' })
      await carregar()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao excluir concurso')
    }
  }

  const filtrados = concursos.filter((concurso) =>
    `${concurso.nome} ${concurso.orgao}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  )

  return (
    <Stack p="md">
      <Group justify="space-between">
        <Title order={2}>Concursos</Title>
        {isAdmin && <Button onClick={novo}>Novo concurso</Button>}
      </Group>

      {!aberto && erro && (
        <Alert color="red">{erro}</Alert>
      )}

      <TextInput
        label="Pesquisar concursos"
        placeholder="Digite o nome ou órgão"
        value={busca}
        onChange={(evento) => setBusca(evento.currentTarget.value)}
      />

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nome</Table.Th>
            <Table.Th>Órgão</Table.Th>
            <Table.Th>Status</Table.Th>
            {isAdmin && <Table.Th>Ações</Table.Th>}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {filtrados.map((concurso) => (
            <Table.Tr key={concurso.id}>
              <Table.Td>{concurso.nome}</Table.Td>
              <Table.Td>{concurso.orgao}</Table.Td>
              <Table.Td>{concurso.status}</Table.Td>
              {isAdmin && <Table.Td>
                <Group gap="xs">
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => editar(concurso)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    variant="light"
                    onClick={() => void excluir(concurso)}
                  >
                    Excluir
                  </Button>
                </Group>
              </Table.Td>}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {filtrados.length === 0 && <p>Nenhum concurso encontrado.</p>}

      <Modal
        opened={isAdmin && aberto}
        onClose={() => setAberto(false)}
        title={editando === null ? 'Novo concurso' : 'Editar concurso'}
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
                setFormulario({ ...formulario, nome: evento.currentTarget.value })
              }
            />

            <TextInput
              label="Órgão"
              required
              value={formulario.orgao}
              onChange={(evento) =>
                setFormulario({ ...formulario, orgao: evento.currentTarget.value })
              }
            />

            <Textarea
              label="Descrição"
              required
              value={formulario.descricao}
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  descricao: evento.currentTarget.value,
                })
              }
            />

            <TextInput
              label="Data de abertura"
              type="date"
              required
              value={formulario.dataAbertura}
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  dataAbertura: evento.currentTarget.value,
                })
              }
            />

            <TextInput
              label="Data de encerramento"
              type="date"
              required
              value={formulario.dataEncerramento}
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  dataEncerramento: evento.currentTarget.value,
                })
              }
            />

            <Select
              label="Status"
              data={[
                { value: 'ABERTO', label: 'Aberto' },
                { value: 'ENCERRADO', label: 'Encerrado' },
              ]}
              value={formulario.status}
              onChange={(valor) =>
                setFormulario({
                  ...formulario,
                  status: valor === 'ENCERRADO' ? 'ENCERRADO' : 'ABERTO',
                })
              }
            />

            <Button type="submit" loading={carregando}>
              Salvar
            </Button>
          </Stack>
        </form>
      </Modal>
    </Stack>
  )
}
