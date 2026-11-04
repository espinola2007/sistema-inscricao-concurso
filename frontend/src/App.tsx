// App provisório só para rodar o módulo de inscrições.
// A T substitui por navegação/rotas e layout compartilhado.
import { useState } from 'react'
import { Container, SegmentedControl, Stack } from '@mantine/core'
import { InscricaoFormPage } from './pages/Inscricoes/InscricaoFormPage.tsx'
import { InscricoesListPage } from './pages/Inscricoes/InscricoesListPage.tsx'

function App() {
  const [aba, setAba] = useState('nova')
  const [recarregar, setRecarregar] = useState(0)

  return (
    <Container py="xl">
      <Stack align="center">
        <SegmentedControl
          value={aba}
          onChange={(v) => setAba(String(v))}
          data={[
            { value: 'nova', label: 'Nova inscrição' },
            { value: 'lista', label: 'Inscrições realizadas' },
          ]}
        />
        {aba === 'nova' ? (
          <InscricaoFormPage onSucesso={() => setRecarregar((n) => n + 1)} />
        ) : (
          <InscricoesListPage recarregarKey={recarregar} />
        )}
      </Stack>
    </Container>
  )
}

export default App
