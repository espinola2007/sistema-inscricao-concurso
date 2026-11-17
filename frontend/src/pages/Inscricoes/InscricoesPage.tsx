import { useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Group,
  Loader,
  Modal,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { inscricaoSchema } from '@concursos/shared'
import {
  inscricaoService,
  type Inscricao,
} from '../../services/inscricaoService.ts'
import {
  opcoesService,
  type CandidatoOpcao,
  type ConcursoOpcao,
} from '../../services/opcoesService.ts'

function concursoAberto(concurso: ConcursoOpcao) {
  const agora = new Date()
  return (
    concurso.status.toUpperCase() === 'ABERTO' &&
    agora >= new Date(concurso.dataAbertura) &&
    agora <= new Date(concurso.dataEncerramento)
  )
}

export function InscricoesPage() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [candidatos, setCandidatos] = useState<CandidatoOpcao[]>([])
  const [concursos, setConcursos] = useState<ConcursoOpcao[]>([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [aberto, setAberto] = useState(false)
  const [editando, setEditando] = useState<number | null>(null)
  const [candidatoId, setCandidatoId] = useState<string | null>(null)
  const [concursoId, setConcursoId] = useState<string | null>(null)

  async function carregar() {
    try {
      const [listaInscricoes, listaCandidatos, listaConcursos] =
        await Promise.all([
          inscricaoService.listar(),
          opcoesService.candidatos(),
          opcoesService.concursos(),
        ])

      setInscricoes(listaInscricoes)
      setCandidatos(listaCandidatos)
      setConcursos(listaConcursos)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar inscrições')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    void carregar()
  }, [])

  function nova() {
    setEditando(null)
    setCandidatoId(null)
    setConcursoId(null)
    setErro('')
    setAberto(true)
  }

  function editar(inscricao: Inscricao) {
    setEditando(inscricao.id)
    setCandidatoId(String(inscricao.candidatoId))
    setConcursoId(String(inscricao.concursoId))
    setErro('')
    setAberto(true)
  }

  async function salvar() {
    setErro('')

    // Mesmo schema do shared que a API usa no validarBody
    const resultado = inscricaoSchema.safeParse({
      candidatoId: candidatoId ? Number(candidatoId) : undefined,
      concursoId: concursoId ? Number(concursoId) : undefined,
    })

    if (!resultado.success) {
      setErro(resultado.error.issues.map((item) => item.message).join('; '))
      return
    }

    setSalvando(true)

    try {
      if (editando === null) {
        await inscricaoService.criar(resultado.data)
      } else {
        await inscricaoService.atualizar(editando, resultado.data)
      }

      setAberto(false)
      await carregar()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao salvar inscrição')
    } finally {
      setSalvando(false)
    }
  }

  async function excluir(inscricao: Inscricao) {
    if (!window.confirm(`Deseja excluir a inscrição nº ${inscricao.id}?`)) return

    setErro('')

    try {
      await inscricaoService.excluir(inscricao.id)
      await carregar()
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
    <Stack p="md">
      <Group justify="space-between">
        <Title order={2}>Inscrições</Title>
        <Button onClick={nova}>Nova inscrição</Button>
      </Group>

      {!aberto && erro && <Alert color="red">{erro}</Alert>}

      <TextInput
        label="Pesquisar inscrições"
        placeholder="Número, candidato ou concurso"
        value={busca}
        onChange={(evento) => setBusca(evento.currentTarget.value)}
      />

      {carregando && <Loader />}

      {!carregando && (
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
                      onClick={() => editar(inscricao)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      variant="light"
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

      {!carregando && filtradas.length === 0 && (
        <Text c="dimmed">Nenhuma inscrição encontrada.</Text>
      )}

      <Modal
        opened={aberto}
        onClose={() => setAberto(false)}
        title={editando === null ? 'Nova inscrição' : 'Editar inscrição'}
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
              placeholder="Selecione um candidato"
              searchable
              data={candidatos.map((candidato) => ({
                value: String(candidato.id),
                label: `${candidato.nome} (${candidato.cpf})`,
              }))}
              value={candidatoId}
              onChange={setCandidatoId}
            />

            <Select
              label="Concurso"
              placeholder="Selecione um concurso"
              searchable
              data={concursos.map((concurso) => ({
                value: String(concurso.id),
                label: `${concurso.nome} — ${concurso.orgao}${
                  concursoAberto(concurso) ? '' : ' (encerrado)'
                }`,
                // Concurso fechado só aparece desabilitado; o que já está
                // na inscrição sendo editada continua selecionável.
                disabled:
                  !concursoAberto(concurso) &&
                  String(concurso.id) !== concursoId,
              }))}
              value={concursoId}
              onChange={setConcursoId}
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
