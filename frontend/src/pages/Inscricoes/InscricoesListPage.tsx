import { useCallback, useEffect, useState } from 'react'
import { Alert, Badge, Loader, Paper, Table, Text, Title } from '@mantine/core'
import { inscricaoService, type Inscricao } from '../../services/inscricaoService.ts'

export function InscricoesListPage({ recarregarKey = 0 }: { recarregarKey?: number }) {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(() => {
    setCarregando(true)
    setErro(null)
    inscricaoService
      .listar()
      .then(setInscricoes)
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  useEffect(carregar, [carregar, recarregarKey])

  return (
    <Paper withBorder shadow="md" p="xl" radius="md" w="100%" maw={900}>
      <Title order={2} mb="md">Inscrições realizadas</Title>

      {erro && <Alert color="red" mb="md">{erro}</Alert>}
      {carregando && <Loader />}
      {!carregando && !erro && inscricoes.length === 0 && (
        <Text c="dimmed">Nenhuma inscrição registrada ainda.</Text>
      )}

      {inscricoes.length > 0 && (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nº</Table.Th>
              <Table.Th>Candidato</Table.Th>
              <Table.Th>Concurso</Table.Th>
              <Table.Th>Data</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {inscricoes.map((i) => (
              <Table.Tr key={i.id}>
                <Table.Td>{i.id}</Table.Td>
                <Table.Td>{i.candidato.nome}</Table.Td>
                <Table.Td>{i.concurso.nome} — {i.concurso.orgao}</Table.Td>
                <Table.Td>{new Date(i.data).toLocaleDateString('pt-BR')}</Table.Td>
                <Table.Td><Badge color="green">{i.status}</Badge></Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  )
}
