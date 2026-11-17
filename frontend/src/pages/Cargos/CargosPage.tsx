
import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Table,
  TextInput,
  Title,
} from '@mantine/core'
import {
  criarCargoSchema,
  atualizarCargoSchema,
} from '@concursos/shared'
import { request } from '../../services/api'

type Concurso = {
  id: number
  nome: string
}

type Cargo = {
  id: number
  nome: string
  concursoId: number
  concurso?: Concurso
}

export function CargosPage() {
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [concursos, setConcursos] = useState<Concurso[]>([])
  const [busca, setBusca] = useState('')
  const [aberto, setAberto] = useState(false)
  const [editando, setEditando] = useState<number | null>(null)
  const [nome, setNome] = useState('')
  const [concursoId, setConcursoId] = useState<string | null>(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function carregar() {
    try {
      const [listaCargos, listaConcursos] = await Promise.all([
        request<Cargo[]>('/cargos'),
        request<Concurso[]>('/concursos'),
      ])

      setCargos(listaCargos)
      setConcursos(listaConcursos)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar dados')
    }
  }

  useEffect(() => {
    void carregar()
  }, [])

  function novo() {
    setEditando(null)
    setNome('')
    setConcursoId(null)
    setErro('')
    setAberto(true)
  }

  function editar(cargo: Cargo) {
    setEditando(cargo.id)
    setNome(cargo.nome)
    setConcursoId(String(cargo.concursoId))
    setErro('')
    setAberto(true)
  }

  async function salvar() {
    setErro('')

    const dados = {
      nome,
      concursoId: Number(concursoId),
    }

    const resultado =
      editando === null
        ? criarCargoSchema.safeParse(dados)
        : atualizarCargoSchema.safeParse(dados)

    if (!resultado.success) {
      setErro(
        resultado.error.issues
          .map((item) => item.message)
          .join('; '),
      )
      return
    }

    setCarregando(true)

    try {
      await request(
        editando === null ? '/cargos' : `/cargos/${editando}`,
        {
          method: editando === null ? 'POST' : 'PUT',
          body: JSON.stringify(resultado.data),
        },
      )

      setAberto(false)
      await carregar()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao salvar cargo')
    } finally {
      setCarregando(false)
    }
  }

  async function excluir(cargo: Cargo) {
    const confirmado = window.confirm(
      `Deseja realmente excluir o cargo "${cargo.nome}"?`,
    )

    if (!confirmado) return

    setErro('')

    try {
      await request(`/cargos/${cargo.id}`, {
        method: 'DELETE',
      })

      await carregar()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao excluir cargo')
    }
  }

  function nomeConcurso(cargo: Cargo) {
    return (
      cargo.concurso?.nome ??
      concursos.find((concurso) => concurso.id === cargo.concursoId)?.nome ??
      'Concurso não encontrado'
    )
  }

  const cargosFiltrados = cargos.filter((cargo) =>
    `${cargo.nome} ${nomeConcurso(cargo)}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  )

  return (
    <Stack p="md">
      <Group justify="space-between">
        <Title order={2}>Cargos</Title>

        <Button onClick={novo}>
          Novo cargo
        </Button>
      </Group>

      {!aberto && erro && (
        <Alert color="red">{erro}</Alert>
      )}

      <TextInput
        label="Pesquisar cargos"
        placeholder="Digite o cargo ou concurso"
        value={busca}
        onChange={(evento) => setBusca(evento.currentTarget.value)}
      />

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Cargo</Table.Th>
            <Table.Th>Concurso</Table.Th>
            <Table.Th>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {cargosFiltrados.map((cargo) => (
            <Table.Tr key={cargo.id}>
              <Table.Td>{cargo.nome}</Table.Td>
              <Table.Td>{nomeConcurso(cargo)}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => editar(cargo)}
                  >
                    Editar
                  </Button>

                  <Button
                    size="xs"
                    color="red"
                    variant="light"
                    onClick={() => void excluir(cargo)}
                  >
                    Excluir
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {cargosFiltrados.length === 0 && (
        <p>Nenhum cargo encontrado.</p>
      )}

      <Modal
        opened={aberto}
        onClose={() => setAberto(false)}
        title={editando === null ? 'Novo cargo' : 'Editar cargo'}
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
              label="Nome do cargo"
              placeholder="Ex.: Analista de Sistemas"
              required
              value={nome}
              onChange={(evento) => setNome(evento.currentTarget.value)}
            />

            <Select
              label="Concurso"
              placeholder="Selecione um concurso"
              required
              searchable
              data={concursos.map((concurso) => ({
                value: String(concurso.id),
                label: concurso.nome,
              }))}
              value={concursoId}
              onChange={(valor) =>
                setConcursoId(valor === null ? null : String(valor))
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
