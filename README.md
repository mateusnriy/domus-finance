# Domus Finance

Sistema de controle de gastos residenciais. API REST para cadastro de pessoas,
registro de suas transações financeiras (receitas e despesas) e consolidação de
totais, com acesso autenticado.

## Stack

- **Backend:** .NET 8 (ASP.NET Core Web API), C#
- **Persistência:** PostgreSQL 16, Entity Framework Core 8
- **Validação:** FluentValidation
- **Autenticação:** JWT Bearer, senhas com BCrypt
- **Testes:** xUnit, FluentAssertions, SQLite em memória
- **Infraestrutura:** Docker e Docker Compose

## Pré-requisitos

Apenas **Docker** e **Docker Compose**.

Para desenvolvimento local fora do container, também o **.NET 8 SDK**.

## Execução

```bash
cp .env.example .env
```

Preencha o `.env` antes de subir os serviços. O template traz valores de exemplo,
não credenciais funcionais: defina `POSTGRES_DB`, `POSTGRES_USER`,
`POSTGRES_PASSWORD` e uma `JWT_CHAVE` de **no mínimo 32 caracteres**. A aplicação
se recusa a iniciar com chave ausente ou curta — falhar cedo é preferível a
executar com assinatura enfraquecida. O `.env` efetivo é ignorado pelo Git.

```bash
docker compose up --build
```

Um comando sobe banco e API. As migrations são aplicadas na inicialização, com
nova tentativa enquanto o banco não aceita conexões, e os dados de demonstração
são inseridos quando o banco está vazio.

## Credenciais de demonstração

| Campo | Valor |
|-------|-------|
| E-mail | `demo@domusfinance.local` |
| Senha | `Demo@1234` |

## Endereços

| Recurso | Endereço |
|---------|----------|
| Documentação da API | http://localhost:8080/swagger |
| API | http://localhost:8080/api |
| Verificação de saúde | http://localhost:8080/health |

Na documentação, autentique em `POST /api/auth/login`, copie o `token` da
resposta e informe-o no botão **Authorize**. Os endpoints de negócio respondem
401 sem token.

## Estrutura do repositório

```
domus-finance/
├── docker-compose.yml      # orquestração dos serviços
├── .env.example            # template de variáveis de ambiente
├── docs/                   # documentação de engenharia
└── backend/
    ├── DomusFinance.sln
    ├── Dockerfile
    ├── src/
    │   ├── DomusFinance.Domain/          # entidades e regras invariantes
    │   ├── DomusFinance.Application/     # serviços, DTOs, validações
    │   ├── DomusFinance.Infrastructure/  # EF Core, mapeamentos, segurança
    │   └── DomusFinance.Api/             # controllers e configuração
    └── tests/
        └── DomusFinance.Tests/
```

## Testes

```bash
dotnet test backend/DomusFinance.sln
```

Os testes usam SQLite em memória e **não exigem Docker**. A escolha é
deliberada: por ser relacional, cascata e restrições de integridade valem de
verdade, o que um provedor em memória puro não garantiria.

## Documentação de engenharia

O detalhamento de escopo, casos de uso, modelo de domínio, banco de dados e
arquitetura está em [`docs/`](./docs/).

## Decisões técnicas

**Arquitetura em camadas com quatro projetos.** A regra de dependência aponta
para o domínio, e projetos separados — em vez de apenas pastas — tornam essa
regra verificável pelo compilador: `DomusFinance.Domain` não referencia nenhum
outro projeto.

**Regras de negócio no servidor.** A API está correta quando chamada
diretamente, sem cliente. Nenhuma regra depende de validação no navegador.

**Integridade reforçada no banco.** Cada regra verificável em dados existe
também como restrição: idade entre 0 e 130, valor maior que zero, tipo e
categoria como domínios fechados, e-mail único, exclusão em cascata. Uma regra
que vive só em código se perde no primeiro acesso direto ao banco.

**`decimal` para valores monetários**, nunca ponto flutuante. O valor é sempre
positivo; o sentido financeiro vem do tipo, o que elimina ambiguidade no saldo.

**Data do fato separada da data de registro.** `data` é informada pelo usuário e
alimenta os filtros por período; `criado_em` é o instante do registro. Uma
despesa lançada com atraso tem as duas diferentes.

## Além do escopo mínimo

- **Edição e exclusão** de pessoas e transações, além do cadastro e da listagem
- **Categorias** de despesa e **resumo consolidado por categoria**
- **Filtros combináveis** por pessoa, tipo, categoria e período
- **Prevenção de enumeração de contas:** e-mail inexistente e senha incorreta
  devolvem resposta idêntica *e* em tempo equivalente — o caminho do e-mail
  inexistente executa uma verificação BCrypt descartável, sem a qual a diferença
  de tempo de resposta revelaria quais e-mails existem
- **`ClockSkew` zerado** na validação do token, removendo a tolerância padrão de
  cinco minutos que faria o token sobreviver além do prazo declarado
- **Falha na inicialização** com mensagem clara quando o segredo de assinatura
  está ausente ou tem menos de 32 caracteres
- **44 testes automatizados** cobrindo as regras de negócio, incluindo a
  exclusão em cascata verificada no banco e a precisão decimal em somas
