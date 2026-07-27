# 00 — Visão Geral do Sistema

## O que é

**Domus Finance** é uma aplicação web para o controle das finanças de uma residência. Ela organiza as pessoas de um domicílio e as movimentações financeiras de cada uma — receitas e despesas — e apresenta, de forma consolidada, quanto cada pessoa e a casa como um todo receberam, gastaram e têm de saldo.

O nome vem de *domus*, "lar" em latim: o sistema trata as contas da casa como um livro-razão da família, com a clareza de um extrato.

## Propósito

Responder, a qualquer momento e sem esforço, a uma pergunta simples que a maioria das residências tem dificuldade de acompanhar: **quem recebeu, quem gastou e como está o saldo da casa.**

O sistema substitui o controle informal — planilhas dispersas, anotações soltas, memória — por um registro único, consistente e sempre disponível, com as regras de negócio garantidas pela própria aplicação.

## Objetivos

1. **Centralizar** o cadastro das pessoas da casa e de suas transações em um só lugar.
2. **Consolidar** receitas, despesas e saldo por pessoa e no total geral, de forma imediata e confiável.
3. **Garantir integridade** das informações, aplicando as regras de negócio no servidor, independentemente do que o cliente envie.
4. **Proteger o acesso**, exigindo autenticação para operar o sistema.
5. **Ser simples de usar**, com uma interface direta, acessível e responsiva, que qualquer morador consiga operar sem treinamento.

## Principais funcionalidades

| Área | O que oferece |
|------|----------------|
| **Acesso** | Registro de usuário e autenticação; a sessão protege todas as operações. |
| **Pessoas** | Cadastro, listagem e exclusão de pessoas. Excluir uma pessoa remove também todas as suas transações, com aviso prévio do impacto. |
| **Transações** | Ciclo completo (criar, listar, editar e excluir) de receitas e despesas, com data e categoria. Filtros por pessoa, tipo, categoria e período. Pessoas menores de idade só podem ter despesas. |
| **Totais** | Consolidação por pessoa (receitas, despesas, saldo), total geral da casa em cartões-resumo e resumo de despesas por categoria, com leitura visual da proporção entre receitas e despesas. |

## Regras que definem o comportamento

Três regras moldam a experiência e distinguem o sistema de um cadastro genérico:

- **Menores de idade só registram despesas.** A restrição é aplicada no momento do lançamento.
- **Excluir uma pessoa apaga suas transações.** A ação é irreversível e, por isso, sempre confirmada com o número de transações afetadas.
- **O saldo pode ser negativo,** e pessoas sem nenhuma transação continuam aparecendo na consolidação, com valores zerados.

## Público-alvo

**Usuário primário — o responsável pelas finanças do domicílio.** Um morador adulto que administra as contas da casa: registra os ganhos e gastos das pessoas, acompanha o saldo e usa a consolidação para tomar decisões do dia a dia. Não é necessariamente alguém com conhecimento de finanças ou de tecnologia; espera uma ferramenta clara e sem fricção.

**Pessoas controladas — os demais moradores.** Aparecem como dados no sistema (nome, idade e transações), mas não precisam operá-lo. Incluem crianças e adolescentes, o que motiva a regra de restrição por idade.

**Perfil de uso.** Uso individual ou compartilhado dentro de uma mesma casa, em que os moradores autenticados enxergam o mesmo conjunto de informações. O volume de dados é pequeno e o acesso é frequente e rápido — consultar o saldo é uma ação corriqueira, não um relatório mensal.

## Contexto e limites

Domus Finance cobre o ciclo completo do controle doméstico: gestão de pessoas e transações (com data e categoria), consolidações e filtros. Está **fora do seu escopo** atual: categorias gerenciáveis pelo próprio usuário (a lista é fixa), orçamentos e metas, transações recorrentes, múltiplas residências isoladas por usuário e relatórios exportáveis. Esses caminhos estão registrados como evolução futura na documentação de arquitetura, mas não fazem parte da entrega.

A decisão é deliberada: um escopo enxuto, bem executado e com regras corretas vale mais do que um conjunto amplo de funcionalidades superficiais.
