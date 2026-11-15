
import { useState } from 'react'
import {
  Button,
  Container,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core'

import { AuthPage } from './pages/Auth/AuthPage.tsx'
import { ConcursosPage } from './pages/Concursos/ConcursosPage.tsx'
import { CargosPage } from './pages/Cargos/CargosPage.tsx'
import { CandidatosPage } from './pages/Candidatos/CandidatosPage.tsx'
import { InscricaoFormPage } from './pages/Inscricoes/InscricaoFormPage.tsx'
import { InscricoesListPage } from './pages/Inscricoes/InscricoesListPage.tsx'

type Usuario = {
  id: number
  nome: string
  email: string
}

function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [pagina, setPagina] = useState('concursos')
  const [recarregar, setRecarregar] = useState(0)

  if (!usuario) {
    return <AuthPage onLogin={setUsuario} />
  }

  return (
    <Container size="lg" py="xl">
      <Stack>
        <Group justify="space-between">
          <Title order={1}>Sistema de Inscrições em Concursos</Title>

          <Button
            color="red"
            variant="light"
            onClick={() => {
              setUsuario(null)
              setPagina('concursos')
            }}
          >
            Sair
          </Button>
        </Group>

        <Text>Bem-vindo(a), {usuario.nome}!</Text>

        <SegmentedControl
          value={pagina}
          onChange={(valor) => setPagina(String(valor))}
          data={[
            { value: 'concursos', label: 'Concursos' },
            { value: 'cargos', label: 'Cargos' },
            { value: 'candidatos', label: 'Candidatos' },
            { value: 'nova-inscricao', label: 'Nova inscrição' },
            { value: 'inscricoes', label: 'Inscrições' },
          ]}
        />

        {pagina === 'concursos' && <ConcursosPage />}

        {pagina === 'cargos' && <CargosPage />}

        {pagina === 'candidatos' && <CandidatosPage />}

        {pagina === 'nova-inscricao' && (
          <InscricaoFormPage
            onSucesso={() => {
              setRecarregar((valor) => valor + 1)
              setPagina('inscricoes')
            }}
          />
        )}

        {pagina === 'inscricoes' && (
          <InscricoesListPage recarregarKey={recarregar} />
        )}
      </Stack>
    </Container>
  )
}

export default App
