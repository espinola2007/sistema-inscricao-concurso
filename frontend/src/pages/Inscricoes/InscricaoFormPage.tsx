import { useEffect, useState } from 'react'
import { Alert, Button, Loader, Paper, Select, Stack, Text, Title } from '@mantine/core'
import { inscricaoService } from '../../services/inscricaoService.ts'
import {
  opcoesService,
  type CandidatoOpcao,
  type ConcursoOpcao,
} from '../../services/opcoesService.ts'

function concursoAberto(c: ConcursoOpcao) {
  const agora = new Date()
  return (
    c.status.toUpperCase() === 'ABERTO' &&
    agora >= new Date(c.dataAbertura) &&
    agora <= new Date(c.dataEncerramento)
  )
}

interface Props {
  // Permite à T pré-selecionar o concurso quando vier do card da página inicial
  concursoIdInicial?: number
  onSucesso?: () => void
}

export function InscricaoFormPage({ concursoIdInicial, onSucesso }: Props) {
  const [candidatos, setCandidatos] = useState<CandidatoOpcao[]>([])
  const [concursos, setConcursos] = useState<ConcursoOpcao[]>([])
  const [candidatoId, setCandidatoId] = useState<string | null>(null)
  const [concursoId, setConcursoId] = useState<string | null>(
    concursoIdInicial ? String(concursoIdInicial) : null,
  )
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([opcoesService.candidatos(), opcoesService.concursos()])
      .then(([cands, concs]) => {
        setCandidatos(cands)
        setConcursos(concs)
      })
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  async function enviar(e: React.SyntheticEvent) {
    e.preventDefault()
    setErro(null)
    setSucesso(null)
    if (!candidatoId || !concursoId) {
      setErro('Selecione o candidato e o concurso.')
      return
    }
    setEnviando(true)
    try {
      const inscricao = await inscricaoService.criar({
        candidatoId: Number(candidatoId),
        concursoId: Number(concursoId),
      })
      setSucesso(`Inscrição nº ${inscricao.id} realizada em "${inscricao.concurso.nome}".`)
      setCandidatoId(null)
      onSucesso?.()
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) return <Loader />

  return (
    <Paper withBorder shadow="md" p="xl" radius="md" w="100%" maw={480}>
      <Title order={2}>Nova inscrição</Title>
      <Text c="dimmed" size="sm" mb="lg">Escolha o candidato e o concurso</Text>

      <form onSubmit={enviar}>
        <Stack>
          {erro && <Alert color="red">{erro}</Alert>}
          {sucesso && <Alert color="green">{sucesso}</Alert>}

          <Select
            label="Candidato"
            placeholder="Selecione"
            searchable
            data={candidatos.map((c) => ({ value: String(c.id), label: `${c.nome} (${c.cpf})` }))}
            value={candidatoId}
            onChange={(v) => setCandidatoId(v === null ? null : String(v))}
          />
          <Select
            label="Concurso"
            placeholder="Selecione"
            searchable
            data={concursos.map((c) => ({
              value: String(c.id),
              label: `${c.nome} — ${c.orgao}${concursoAberto(c) ? '' : ' (encerrado)'}`,
              disabled: !concursoAberto(c),
            }))}
            value={concursoId}
            onChange={(v) => setConcursoId(v === null ? null : String(v))}
          />

          <Button type="submit" loading={enviando}>Inscrever</Button>
        </Stack>
      </form>
    </Paper>
  )
}
