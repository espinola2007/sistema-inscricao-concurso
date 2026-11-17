import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Paper,
  Box,
} from '@mantine/core'

type HomePageProps = {
  nomeUsuario: string
  onNavegar: (pagina: string) => void
}

const concursosDestaque = [
  {
    titulo: 'Concurso Banco do Brasil — Escriturário',
    orgao: 'Banco do Brasil S.A.',
    banca: 'Cesgranrio',
    status: 'Inscrições abertas',
    cor: 'green',
  },
  {
    titulo: 'Concurso Polícia Federal — Agente',
    orgao: 'Polícia Federal',
    banca: 'Cebraspe',
    status: 'Autorizado',
    cor: 'yellow',
  },
  {
    titulo: 'Concurso INSS — Técnico do Seguro Social',
    orgao: 'Instituto Nacional do Seguro Social',
    banca: 'Cebraspe',
    status: 'Previsto',
    cor: 'blue',
  },
]

export function HomePage({ nomeUsuario, onNavegar }: HomePageProps) {
  const [busca, setBusca] = useState('')

  return (
    <Stack gap={0}>
      {/* BANNER PRINCIPAL EM LARGURA TOTAL */}
      <Paper
        radius={0}
        py={{ base: 'xl', md: 70 }}
        style={{
          background:
            'linear-gradient(115deg, #091b40 0%, #102e60 55%, #174b83 100%)',
          color: 'white',
          overflow: 'hidden',
          position: 'relative',
          
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
        }}
      >
        {/* Container interno para manter o texto alinhado com o resto do site */}
        <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
          <Box maw={700}>
            <Badge
              variant="light"
              color="gray"
              radius="xl"
              mb="lg"
              styles={{
                root: {
                  backgroundColor: 'rgba(255,255,255,0.14)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                },
              }}
            >
              ✨ O seu portal de concursos públicos
            </Badge>

            <Title
              order={1}
              mb="md"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                lineHeight: 1.15,
                fontWeight: 800,
              }}
            >
              Encontre os melhores concursos e a preparação ideal para sua aprovação.
            </Title>

            <Text size="lg" c="gray.3" mb="xl" maw={600}>
              Concursos, oportunidades e informações organizadas para
              ajudar você a conquistar sua vaga no serviço público.
            </Text>

            {/* CAMPO DE PESQUISA */}
            <Paper p={6} radius="md" bg="white" maw={650}>
              <Group gap={5} wrap="nowrap">
                <TextInput
                  variant="unstyled"
                  placeholder="Busque por concurso, cargo, estado ou órgão..."
                  value={busca}
                  onChange={(event) => setBusca(event.currentTarget.value)}
                  style={{ flex: 1 }}
                  styles={{
                    input: {
                      color: '#243247',
                      paddingLeft: 12,
                    },
                  }}
                />

                <Button
                  color="blue"
                  radius="md"
                  onClick={() => onNavegar('concursos')}
                >
                  Buscar
                </Button>
              </Group>
            </Paper>

            <Group mt="lg" gap="xl">
              <Text size="xs" c="gray.3">📋 Editais e oportunidades</Text>
              <Text size="xs" c="gray.3">🎯 Concursos organizados</Text>
              <Text size="xs" c="gray.3">📈 Acompanhe suas inscrições</Text>
            </Group>

            <Text size="xs" c="gray.4" mt="xl">
              {nomeUsuario !== 'Visitante'
                ? `Bem-vindo(a) de volta, ${nomeUsuario}!`
                : 'Comece sua busca pelo próximo concurso.'}
            </Text>
          </Box>
        </Container>

        {/* ELEMENTO DECORATIVO */}
        <Box
          visibleFrom="md"
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
            right: 40,
            top: 30,
            pointerEvents: 'none',
          }}
        />
      </Paper>

      {/* RESTANTE DO CONTEÚDO CENTRALIZADO */}
      <Container size="xl" py={40} w="100%">
        {/* CONCURSOS EM DESTAQUE */}
        <Group justify="space-between" align="end" mb="xl">
          <Stack gap={4}>
            <Text size="xs" fw={700} c="blue" tt="uppercase">
              Em destaque
            </Text>

            <Title order={2} c="#172b45">
              Concursos do momento
            </Title>

            <Text c="dimmed" size="sm">
              Confira as oportunidades cadastradas no sistema.
            </Text>
          </Stack>

          <Button
            variant="subtle"
            color="blue"
            onClick={() => onNavegar('concursos')}
          >
            Ver todos os concursos →
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mb={50}>
          {concursosDestaque.map((concurso) => (
            <Card
              key={concurso.titulo}
              shadow="xs"
              padding="lg"
              radius="md"
              withBorder
              style={{
                borderColor: '#e5eaf1',
                transition: 'transform 150ms ease',
              }}
            >
              <Stack gap="md">
                <Group justify="space-between" align="center">
                  <Badge color={concurso.cor} variant="light" radius="xl">
                    {concurso.status}
                  </Badge>

                  <Badge color="gray" variant="light">
                    {concurso.banca}
                  </Badge>
                </Group>

                <Title order={4} size="md" c="#172b45">
                  {concurso.titulo}
                </Title>

                <Text size="sm" c="dimmed">
                  {concurso.orgao}
                </Text>

                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  onClick={() => onNavegar('concursos')}
                >
                  Consultar concurso
                </Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>

        {/* CHAMADA PARA INSCRIÇÕES */}
        <Paper p="xl" radius="lg" bg="#eaf1fa">
          <Group justify="space-between" align="center">
            <Stack gap={5}>
              <Title order={3} c="#17365c">
                Acompanhe suas inscrições!
              </Title>

              <Text size="sm" c="dimmed">
                Consulte suas inscrições e acompanhe seus concursos.
              </Text>
            </Stack>

            <Button color="blue" onClick={() => onNavegar('inscricoes')}>
              Minhas inscrições
            </Button>
          </Group>
        </Paper>
      </Container>
    </Stack>
  )
}