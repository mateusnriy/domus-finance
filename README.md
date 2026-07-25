# Domus Finance

Sistema de controle de gastos residenciais. API REST para cadastro de pessoas,
registro de suas transações financeiras (receitas e despesas) e consolidação de
totais, com acesso autenticado.

## Stack

- **Backend:** .NET 8 (ASP.NET Core Web API), C#
- **Persistência:** PostgreSQL 16, Entity Framework Core 8
- **Validação:** FluentValidation
- **Autenticação:** JWT
- **Testes:** xUnit, FluentAssertions
- **Infraestrutura:** Docker e Docker Compose

## Pré-requisitos

- Docker e Docker Compose

Para desenvolvimento local do backend, também é necessário o **.NET 8 SDK**.

## Execução

### Banco de dados

```bash
cp .env.example .env
docker compose up db
```

O PostgreSQL sobe na porta definida por `DB_PORT` (padrão `5432`), com os dados
persistidos no volume `pgdata`.

### Build do backend

```bash
dotnet build backend/DomusFinance.sln
```

## Estrutura do repositório

```
domus-finance/
├── docker-compose.yml      # orquestração dos serviços
├── .env.example            # template de variáveis de ambiente
├── docs/                   # documentação de engenharia
└── backend/
    ├── DomusFinance.sln
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

## Documentação de engenharia

O detalhamento de escopo, casos de uso, modelo de domínio, banco de dados e
arquitetura está em [`docs/`](./docs/).
