
# Sistema Web de Inscrições em Concursos Públicos

**Vídeo de apresentação:** 

## 1. Sobre o projeto

Sistema web desenvolvido como Projeto Final A2 da disciplina de Desenvolvimento Web.

A aplicação permite gerenciar concursos públicos, cargos, candidatos e inscrições, além de oferecer cadastro e login de usuários.

O projeto utiliza uma API REST integrada a uma aplicação React e um banco de dados PostgreSQL.

## 2. Integrantes

| Integrante | RGM | Responsabilidade |
|---|---|---|
| Maria Vitória Espínola Carneiro | [INSERIR RGM] | Concursos, Cargos e autenticação |
| Anny [COMPLETAR NOME] | [INSERIR RGM] | Inscrições |
| Evelyn Vivian Silva da Costa | 44734212 | Candidatos |
| Tainara David De França | 42786967 | Frontend |

A integração final do sistema contou com a implementação e adaptação de funcionalidades entre os módulos.

## 3. Tecnologias utilizadas

**Backend**
- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod
- bcrypt
- Swagger / OpenAPI

**Frontend**
- React
- TypeScript
- Vite
- Mantine UI
- Axios
- Zod

**Ferramentas**
- Docker Compose
- Git e GitHub
- npm workspaces

## 4. Funcionalidades

### Concursos
- Listar concursos
- Consultar concurso por ID
- Cadastrar concurso
- Editar concurso
- Excluir concurso
- Pesquisar concursos por texto

### Cargos
- Listar cargos
- Consultar cargo por ID
- Cadastrar cargo vinculado a um concurso
- Editar cargo
- Excluir cargo
- Exibir o concurso relacionado

### Candidatos
- Listar candidatos
- Consultar candidato por ID
- Cadastrar candidato
- Editar candidato
- Excluir candidato
- Pesquisar candidatos por texto

### Inscrições
- Listar inscrições
- Consultar inscrição por ID
- Registrar inscrição
- Editar inscrição
- Excluir inscrição
- Consultar os nomes do candidato e do concurso relacionados

A aplicação impede inscrições duplicadas do mesmo candidato no mesmo concurso e verifica se o período de inscrições está aberto.

### Usuários
- Cadastro de usuários
- Login com e-mail e senha
- Senhas armazenadas com hash bcrypt
- Validação dos formulários com Zod

O login demonstra a verificação das credenciais. Não há emissão de JWT nem sessão persistente para proteção das rotas da API.

## 5. Estrutura do projeto

```text
sistema-inscricao-concurso/
├── backend/               # Workspace api
│   ├── prisma/             # Schema, migrations e seed
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── repositories/
│       ├── routes/
│       └── services/
├── frontend/              # Aplicação React
│   └── src/
│       ├── pages/
│       └── services/
├── shared/                # Schemas Zod compartilhados
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

A API segue a arquitetura:

**Routes → Controllers → Services → Repositories → Prisma**

Os schemas compartilhados permitem reutilizar validações entre backend e frontend.

## 6. Requisitos para executar

É necessário ter instalado:

- Node.js e npm
- Docker Desktop com Docker Compose
- Git

O PostgreSQL será executado em um contêiner Docker.

## 7. Instalação e execução

Todos os comandos abaixo devem ser executados a partir da raiz do projeto, salvo quando houver indicação para entrar na pasta `backend`.

### 7.1. Clonar o repositório

```bash
git clone https://github.com/espinola2007/sistema-inscricao-concurso.git
cd sistema-inscricao-concurso
```

### 7.2. Instalar as dependências

```bash
npm install
```

O projeto utiliza npm workspaces, permitindo instalar as dependências dos três pacotes a partir da raiz.

### 7.3. Iniciar o PostgreSQL

Com o Docker Desktop em execução:

```bash
docker compose up -d
```

O arquivo `docker-compose.yml` configura o PostgreSQL com:

| Configuração | Valor |
|---|---|
| Host | localhost |
| Porta | 5432 |
| Banco | concursos |
| Usuário | postgres |
| Senha | postgres |

Essas credenciais são destinadas exclusivamente ao ambiente local de desenvolvimento.

### 7.4. Configurar as variáveis de ambiente

Na pasta `backend`, crie o arquivo `.env` copiando o exemplo:

**Windows PowerShell:**

```powershell
Copy-Item backend/.env.example backend/.env
```

O conteúdo de exemplo é:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/concursos?schema=public"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

Para o frontend, copie o arquivo de exemplo:

```powershell
Copy-Item frontend/.env.example frontend/.env
```

Conteúdo:

```env
VITE_API_URL=http://localhost:3000
```

### 7.5. Aplicar as migrations e gerar o Prisma Client

Entre na pasta do backend:

```bash
cd backend
```

Execute:

```bash
npx prisma migrate deploy
npx prisma generate
```

Esses comandos aplicam as migrations existentes e geram o cliente Prisma.

### 7.6. Popular o banco com dados de exemplo

Ainda na pasta `backend`, execute:

```bash
npx tsx prisma/seed.ts
```

O seed prepara dados de exemplo para:

- Usuários
- Concursos
- Cargos
- Candidatos
- Inscrições

Os registros estão relacionados conforme o modelo do banco de dados.

### 7.7. Iniciar a API

Volte à raiz:

```bash
cd ..
```

Execute:

```bash
npm run dev -w api
```

A API será iniciada em:

http://localhost:3000

A documentação Swagger estará disponível em:

http://localhost:3000/docs/

### 7.8. Iniciar o frontend

Abra outro terminal na raiz do projeto e execute:

```bash
npm run dev -w frontend
```

Acesse no navegador:

http://localhost:5173

Mantenha a API e o frontend em execução durante a utilização do sistema.

## 8. Credenciais para demonstração

O seed cria o seguinte usuário administrador:

| Campo | Valor |
|---|---|
| E-mail | admin@concursos.com |
| Senha | Admin@123456 |

Essas credenciais são apenas para testes e demonstração acadêmica.

Também é possível cadastrar um usuário pela interface.

## 9. Comandos de compilação

Na raiz do projeto:

**Compilar a API:**

```bash
npm run build -w api
```

**Compilar o frontend:**

```bash
npm run build -w frontend
```

**Compilar o pacote compartilhado:**

```bash
npm run build -w @concursos/shared
```

## 10. Endpoints da API

As quatro entidades principais possuem as seguintes operações:

| Método | Concursos | Cargos | Candidatos | Inscrições |
|---|---|---|---|---|
| GET | `/concursos` | `/cargos` | `/candidatos` | `/inscricoes` |
| GET por ID | `/concursos/:id` | `/cargos/:id` | `/candidatos/:id` | `/inscricoes/:id` |
| POST | `/concursos` | `/cargos` | `/candidatos` | `/inscricoes` |
| PUT | `/concursos/:id` | `/cargos/:id` | `/candidatos/:id` | `/inscricoes/:id` |
| DELETE | `/concursos/:id` | `/cargos/:id` | `/candidatos/:id` | `/inscricoes/:id` |

**Autenticação:**

| Método | Rota | Função |
|---|---|---|
| POST | `/usuarios` | Cadastrar usuário |
| POST | `/login` | Validar credenciais |

As rotas estão documentadas no Swagger.

## 11. Banco de dados

O projeto possui quatro entidades principais relacionadas:

- **Candidato:** armazena os dados do candidato.
- **Concurso:** armazena os concursos disponíveis.
- **Cargo:** pertence a um concurso.
- **Inscrição:** relaciona um candidato a um concurso.

A entidade **Usuário** é utilizada separadamente para cadastro e login.

As relações entre as entidades são implementadas com chaves estrangeiras no PostgreSQL.

O banco também possui restrições de unicidade, incluindo CPF do candidato, e-mail do usuário e combinação de candidato e concurso na inscrição.

## 12. Validação e tratamento de erros

O sistema utiliza Zod para validar os dados recebidos pela API e os formulários do frontend.

Entre os códigos HTTP utilizados estão:

- `200` — Operação realizada com sucesso.
- `201` — Registro criado.
- `204` — Registro excluído.
- `400` — Dados ou JSON inválidos.
- `404` — Registro não encontrado.
- `409` — Conflito ou registro duplicado.
- `422` — Regra de negócio impede a operação.

As senhas dos usuários não são retornadas nas respostas de cadastro e login.

## 13. Testes

Foram realizados testes funcionais das operações de cadastro, listagem, edição e exclusão pela interface.

Os builds da API e do frontend também foram executados com sucesso.

Para executar os testes automatizados existentes no backend, com o banco configurado:

```bash
npm test -w api
```

## 14. Vídeo de apresentação

**Link:** 

O vídeo deverá apresentar o funcionamento do sistema, a organização do código, as tecnologias utilizadas e as principais operações implementadas.
