# 04 — Modelagem do Banco de Dados

Banco: **PostgreSQL 16**. Mapeamento: **Entity Framework Core 8** com migrations.

## 1. Modelo Entidade-Relacionamento

```mermaid
erDiagram
    PESSOA ||--o{ TRANSACAO : "possui"

    USUARIO {
        uuid id PK
        string nome
        string email UK
        string senha_hash
        timestamp criado_em
    }

    PESSOA {
        uuid id PK
        string nome
        int idade
        timestamp criado_em
    }

    TRANSACAO {
        uuid id PK
        string descricao
        decimal valor
        string tipo
        uuid pessoa_id FK
        timestamp criado_em
    }
```

**Cardinalidades**

- `PESSOA` 1 : N `TRANSACAO` — uma pessoa possui zero ou muitas transações; cada transação pertence a exatamente uma pessoa, com exclusão em cascata.
- `USUARIO` é uma entidade isolada. A ausência de relacionamento é intencional e está justificada no documento 03.