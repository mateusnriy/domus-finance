# Documentação de Engenharia de Software — Domus Finance

Sistema de controle de gastos residenciais.

## Documentos

| # | Documento | Conteúdo |
|---|-----------|----------|
| 00 | [Visão Geral](./00-visao-geral.md) | O que é o sistema, propósito e objetivos |
| 01 | [Escopo e Requisitos](./01-escopo-e-requisitos.md) | Visão geral, requisitos funcionais e não funcionais, regras de negócio |
| 02 | [Casos de Uso](./02-casos-de-uso.md) | Atores, diagrama e especificação dos casos de uso |
| 03 | [Diagrama de Classes](./03-diagrama-de-classes.md) | Modelo de classes do domínio |
| 04 | [Banco de Dados](./04-banco-de-dados.md) | MER, modelo lógico e modelo físico |
| 05 | [Arquitetura](./05-arquitetura.md) | Camadas, decisões técnicas e segurança |
| 06 | [Design Brief](./06-design-brief.md) | Direção visual, tokens e guia de wireframes |
| 07 | [Uso de IA](./07-uso-de-ia.md) | Onde a IA apoiou o desenvolvimento e sob qual revisão |

## Sobre o sistema

**Domus Finance** permite controlar as finanças de uma residência a partir do cadastro de pessoas e de suas transações (receitas e despesas), com consolidação de totais individuais e gerais. O acesso é protegido por autenticação.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Back-end | .NET 8 (LTS) · ASP.NET Core Web API · EF Core 8 |
| Autenticação | JWT Bearer · BCrypt |
| Front-end | React 18 · TypeScript · Vite |
| Banco | PostgreSQL 16 |
| Ambiente | Docker · Docker Compose |
| Arquitetura | Camadas (Layered / N-tier) |

## Convenção de identificadores

| Prefixo | Significado |
|---------|-------------|
| `RF` | Requisito funcional |
| `RNF` | Requisito não funcional |
| `RN` | Regra de negócio |
| `UC` | Caso de uso |

Os identificadores são referenciados diretamente nos comentários do código-fonte, criando rastreabilidade entre documentação e implementação.