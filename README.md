# Módulo de Inscrições (Anny)

Relaciona **candidatos** e **concursos**. Mesma arquitetura da API da clínica:
`routes → controllers → services → repositories → Prisma`, validação com Zod e docs Swagger.

## Rodar

```bash
# banco (use o docker-compose da clínica trocando POSTGRES_DB para "concursos", ou qualquer Postgres)
cd backend
cp .env.example .env        # ajuste DATABASE_URL
npm install
npx prisma migrate dev --name init
npm run dev                 # http://localhost:3000  | docs: /docs

cd ../frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

Testes (precisam do Postgres + migrate): `cd backend && npm test`

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| POST | `/inscricoes` | Registra inscrição. Body: `{ "candidatoId": 1, "concursoId": 1 }` |
| GET | `/inscricoes` | Lista. Filtros opcionais: `?candidatoId=1&concursoId=2` |
| GET | `/inscricoes/:id` | Consulta por ID |

Cada inscrição vem com `candidato` e `concurso` aninhados, `data` (automática) e `status` (`CONFIRMADA`).

### Regras e erros do POST

| Situação | HTTP |
|---|---|
| Body inválido (ids ausentes, não inteiros, ≤ 0) | 400 |
| Candidato ou concurso não existe | 404 |
| Concurso com `status` ≠ `ABERTO` ou hoje fora de `dataAbertura`–`dataEncerramento` | 422 |
| Candidato já inscrito no concurso (também garantido por `@@unique` no banco) | 409 |

Exemplos em `backend/requests.http`.

## Para juntar com o grupo

- `prisma/schema.prisma`: os models `Candidato` e `Concurso` são provisórios. Use os da Evelyn e da Maria Vitória e mantenha o campo `inscricoes Inscricao[]` em cada um.
- `repositories/candidatoRepository.ts` e `concursoRepository.ts` são **stubs** só com `findById`. Substitua pelos delas (precisam exportar `findById`).
- Regra de "inscrições abertas" está em `inscricaoService.ts` (`inscricoesAbertas`). Se o status do concurso tiver outros valores além de `ABERTO`, ajuste ali.
- `server.ts` / `swagger.ts`: registrar também as rotas dos outros módulos.
- Front: o formulário usa `GET /candidatos` e `GET /concursos` (`services/opcoesService.ts`) e aceita `concursoIdInicial` para a T pré-selecionar o concurso a partir da página inicial. `App.tsx` é provisório.
