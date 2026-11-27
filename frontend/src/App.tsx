
import { useState } from 'react'
import { definirToken } from './services/api'

import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core'

import { AuthPage } from './pages/Auth/AuthPage.tsx'
import { ConcursosPage } from './pages/Concursos/ConcursosPage.tsx'
import { CargosPage } from './pages/Cargos/CargosPage.tsx'
import { CandidatosPage } from './pages/Candidatos/CandidatosPage.tsx'
import { HomePage } from './pages/Home/HomePage.tsx'
import { InscricaoFormPage } from './pages/Inscricoes/InscricaoFormPage.tsx'
import { InscricoesListPage } from './pages/Inscricoes/InscricoesListPage.tsx'

type Usuario = {
  id: number
  nome: string
  email: string
  isAdmin?: boolean
}

function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [pagina, setPagina] = useState('home')
  const [recarregar, setRecarregar] = useState(0)

  // Controla a navegação e protege as páginas restritas
  function navegar(destino: string) {
    if (
      (destino === 'inscricoes' || destino === 'nova-inscricao') &&
      !usuario
    ) {
      setPagina('login')
      return
    }

    if (
      (destino === 'cargos' || destino === 'candidatos') &&
      !usuario?.isAdmin
    ) {
      setPagina('home')
      return
    }

    setPagina(destino)
  }

  // Realiza o login
  function realizarLogin(novoUsuario: Usuario) {
    setUsuario(novoUsuario)
    setPagina('inscricoes')
  }

  // Encerra a sessão
  function sair() {
    definirToken(null)
    setUsuario(null)
    setPagina('home')
  }

  return (
    <Stack gap={0} mih="100vh" bg="#f4f7fb">

      {/* CABEÇALHO */}
      <Paper
        radius={0}
        shadow="sm"
        px="xl"
        py="md"
        bg="white"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
        }}
      >
        <Container size="xl" px={0}>
          <Group justify="space-between">

            <Anchor
              underline="never"
              c="#17365c"
              onClick={() => navegar('home')}
            >
              <Title order={2} size="h3" fw={800}>
                Sistema<Text span c="#3978bd">Concursos</Text>
              </Title>
            </Anchor>

            <Group gap="lg">
              <Button
                variant="subtle"
                color="dark"
                onClick={() => navegar('home')}
              >
                Início
              </Button>

              <Button
                variant="subtle"
                color="dark"
                onClick={() => navegar('concursos')}
              >
                Concursos
              </Button>

              {usuario && (
                <>
                  <Button
                    variant="subtle"
                    color="dark"
                    onClick={() => navegar('nova-inscricao')}
                  >
                    Nova inscrição
                  </Button>

                  <Button
                    variant="subtle"
                    color="dark"
                    onClick={() => navegar('inscricoes')}
                  >
                    Minhas inscrições
                  </Button>
                </>
              )}

              {usuario ? (
                <>
                  <Text size="sm" fw={600}>
                    Olá, {usuario.nome} {usuario.isAdmin && '(Admin)'}
                  </Text>

                  <Button color="red" variant="light" onClick={sair}>
                    Sair
                  </Button>
                </>
              ) : (
                <Button color="blue" onClick={() => setPagina('login')}>
                  Entrar
                </Button>
              )}
            </Group>

          </Group>
        </Container>
      </Paper>

      {/* CONTEÚDO PRINCIPAL */}
      <div style={{ flex: 1, width: '100%' }}>
        <Stack gap="xl">

          {/* LOGIN */}
          {pagina === 'login' && (
            <Container size="xl" py="xl">
              <AuthPage onLogin={realizarLogin} />
            </Container>
          )}

          {/* PÁGINA INICIAL */}
          {pagina === 'home' && (
            <HomePage
              nomeUsuario={usuario?.nome ?? 'Visitante'}
              onNavegar={navegar}
            />
          )}

          {/* CONCURSOS */}
          {pagina === 'concursos' && (
            <Container size="xl" py="xl">
              <ConcursosPage isAdmin={usuario?.isAdmin === true} />
            </Container>
          )}

          {/* CARGOS */}
          {pagina === 'cargos' && usuario?.isAdmin && (
            <Container size="xl" py="xl">
              <CargosPage />
            </Container>
          )}

          {/* CANDIDATOS */}
          {pagina === 'candidatos' && usuario?.isAdmin && (
            <Container size="xl" py="xl">
              <CandidatosPage />
            </Container>
          )}

          {/* FORMULÁRIO DE NOVA INSCRIÇÃO */}
          {pagina === 'nova-inscricao' && usuario && (
            <Container size="xl" py="xl">
              <InscricaoFormPage
                onSucesso={() => {
                  setRecarregar((valor) => valor + 1)
                  setPagina('inscricoes')
                }}
              />
            </Container>
          )}

          {/* LISTAGEM DE INSCRIÇÕES */}
          {pagina === 'inscricoes' && usuario && (
            <Container size="xl" py="xl">
              <InscricoesListPage recarregarKey={recarregar} />
            </Container>
          )}

          {/* MENU ADMINISTRATIVO */}
          {usuario?.isAdmin && (
            <Container size="xl" py="md">
              <Paper p="md" radius="md" withBorder>
                <Stack gap="sm">
                  <Text fw={700} c="#17365c">
                    Área de gerenciamento (Acesso restrito)
                  </Text>

                  <SegmentedControl
                    fullWidth
                    value={
                      ['cargos', 'candidatos'].includes(pagina)
                        ? pagina
                        : 'home'
                    }
                    onChange={(valor) => navegar(valor)}
                    data={[
                      { label: 'Início', value: 'home' },
                      { label: 'Cargos', value: 'cargos' },
                      { label: 'Candidatos', value: 'candidatos' },
                    ]}
                  />
                </Stack>
              </Paper>
            </Container>
          )}

        </Stack>
      </div>

      {/* RODAPÉ */}
      <Paper radius={0} bg="#142e4f" c="white" py="xl">
        <Container size="xl">
          <Group justify="space-between" align="flex-start">

            <Stack gap={5} maw={350}>
              <Title order={3} size="h4">
                SistemaConcursos
              </Title>

              <Text size="sm" c="gray.3">
                Sua plataforma para consultar concursos públicos
                e realizar inscrições de maneira simples e organizada.
              </Text>
            </Stack>

            <Stack gap={5}>
              <Text fw={700}>Navegação</Text>

              <Anchor c="gray.3" onClick={() => navegar('home')}>
                Página inicial
              </Anchor>

              <Anchor c="gray.3" onClick={() => navegar('inscricoes')}>
                Minhas inscrições
              </Anchor>
            </Stack>

            <Stack gap={5}>
              <Text fw={700}>Informações</Text>
              <Text size="sm" c="gray.3">
                Plataforma de inscrições em concursos.
              </Text>
            </Stack>

          </Group>

          <Text ta="center" size="xs" c="gray.4" mt="xl">
            © 2026 SistemaConcursos. Todos os direitos reservados.
          </Text>
        </Container>
      </Paper>

    </Stack>
  )
}

export default App

