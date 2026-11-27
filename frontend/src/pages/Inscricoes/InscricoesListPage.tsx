
import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Group,
  Loader,
  Modal,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import {
  inscricaoService,
  type Inscricao,
} from '../../services/inscricaoService.ts'
import { request } from '../../services/api'

type CandidatoOpcao = {
  id: number
  nome: string
}

type ConcursoOpcao = {
  id: number
  nome: string
}

export function InscricoesListPage({
  recarregarKey = 0,
}: {
  recarregarKey?: number
}) {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [candidatos, setCandidatos] = useState<CandidatoOpcao[]>([])
  const [concursos, setConcursos] = useState<ConcursoOpcao[]>([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [candidatoId, setCandidatoId] = useState<string | null>(null)
  const [concursoId, setConcursoId] = useState<string | null>(null)

  const carregar = useCallback(() => {
    setCarregando(true)
    setErro(null)

    inscricaoService
      .listar()
      .then(setInscricoes)
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar, recarregarKey])

  async function editar(inscricao: Inscricao) {
    setErro(null)
    setEditandoId(inscricao.id)
    setCandidatoId(String(inscricao.candidato.id))
    setConcursoId(String(inscricao.concurso.id))
    setModalAberto(true)

    try {
      const [listaCandidatos, listaConcursos] = await Promise.all([
        request<CandidatoOpcao[]>('/candidatos'),
        request<ConcursoOpcao[]>('/concursos'),
      ])

      setCandidatos(listaCandidatos)
      setConcursos(listaConcursos)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar opções')
    }
  }

  async function salvar() {
    setErro(null)

    const candidato = Number(candidatoId)
    const concurso = Number(concursoId)

    if (
      !Number.isInteger(candidato) ||
      candidato < 1 ||
      !Number.isInteger(concurso) ||
      concurso < 1
    ) {
      setErro('Selecione um candidato e um concurso.')
      return
    }

    if (editandoId === null) return

    setSalvando(true)

    try {
      await request(`/inscricoes/${editandoId}`, {
        method: 'PUT',
        body: JSON.stringify({
          candidatoId: candidato,
          concursoId: concurso,
        }),
      })

      setModalAberto(false)
      carregar()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao editar inscrição')
    } finally {
      setSalvando(false)
    }
  }

  async function excluir(inscricao: Inscricao) {
    const confirmado = window.confirm(
      `Deseja excluir a inscrição nº ${inscricao.id}?`,
    )

    if (!confirmado) return

    setErro(null)

    try {
      await request(`/inscricoes/${inscricao.id}`, {
        method: 'DELETE',
      })

      carregar()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao excluir inscrição')
    }
  }

  const filtradas = inscricoes.filter((inscricao) =>
    `${inscricao.id} ${inscricao.candidato.nome} ${inscricao.concurso.nome}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  )

  return (
    <Paper withBorder shadow="md" p="xl" radius="md" w="100%">
      <Stack>
        <Title order={2}>Inscrições realizadas</Title>

        {!modalAberto && erro && <Alert color="red">{erro}</Alert>}

        <TextInput
          label="Pesquisar inscrições"
          placeholder="Número, candidato ou concurso"
          value={busca}
          onChange={(evento) => setBusca(evento.currentTarget.value)}
        />

        {carregando && <Loader />}

        {!carregando && !erro && inscricoes.length === 0 && (
          <Text c="dimmed">Nenhuma inscrição registrada ainda.</Text>
        )}

        {!carregando && inscricoes.length > 0 && (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nº</Table.Th>
                <Table.Th>Candidato</Table.Th>
                <Table.Th>Concurso</Table.Th>
                <Table.Th>Data</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {filtradas.map((inscricao) => (
                <Table.Tr key={inscricao.id}>
                  <Table.Td>{inscricao.id}</Table.Td>
                  <Table.Td>{inscricao.candidato.nome}</Table.Td>
                  <Table.Td>
                    {inscricao.concurso.nome} — {inscricao.concurso.orgao}
                  </Table.Td>
                  <Table.Td>
                    {new Date(inscricao.data).toLocaleDateString('pt-BR')}
                  </Table.Td>
                  <Table.Td>
                    <Badge color="green">{inscricao.status}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => void editar(inscricao)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        color="red"
                        onClick={() => void excluir(inscricao)}
                      >
                        Excluir
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}

        {!carregando && inscricoes.length > 0 && filtradas.length === 0 && (
          <Text>Nenhuma inscrição encontrada.</Text>
        )}
      </Stack>

      <Modal
        opened={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Editar inscrição"
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

            <Select
              label="Candidato"
              required
              searchable
              placeholder="Selecione um candidato"
              data={candidatos.map((candidato) => ({
                value: String(candidato.id),
                label: candidato.nome,
              }))}
              value={candidatoId}
              onChange={(valor) =>
                setCandidatoId(valor === null ? null : String(valor))
              }
            />

            <Select
              label="Concurso"
              required
              searchable
              placeholder="Selecione um concurso"
              data={concursos.map((concurso) => ({
                value: String(concurso.id),
                label: concurso.nome,
              }))}
              value={concursoId}
              onChange={(valor) =>
                setConcursoId(valor === null ? null : String(valor))
              }
            />

            <Button type="submit" loading={salvando}>
              Salvar alterações
            </Button>
          </Stack>
        </form>
      </Modal>
    </Paper>
  )
}
