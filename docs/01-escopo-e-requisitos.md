# 01 - Escopo e Requisitos

## 1. Visão geral

**Domus Finance** é um sistema de controle de gastos residenciais. Permite cadastrar as pessoas de um domicílio, registrar suas transações financeiras (receitas e despesas) e consultar a consolidação de totais individuais e gerais. O acesso é protegido por autenticação.

O escopo é enxuto por decisão de projeto. A prioridade está em separação de responsabilidades, validação consistente, testes das regras críticas e ambiente reproduzível.

## 2. Delimitação do escopo de acesso

A autenticação funciona como **porteira de acesso**, não como isolamento de dados.

| Conceito | Papel no sistema |
|----------|------------------|
| **Usuário** | Quem **opera** o sistema. Possui credenciais. |
| **Pessoa** | Quem é **controlado** pelo sistema. É um dado, não um operador. |

`Usuario` e `Pessoa` são entidades independentes, sem relacionamento. Todos os usuários autenticados operam sobre o mesmo conjunto de dados — o modelo é o de um domicílio compartilhado, em que os moradores acessam as finanças da casa.

Isolamento de dados por usuário (multi-tenancy) está fora do escopo atual. Justificativa no documento 05.

## 3. Requisitos funcionais

### 3.1. Domínio financeiro

| ID | Requisito | Descrição |
|----|-----------|-----------|
| RF01 | Cadastrar pessoa | Criar pessoa com nome e idade; o sistema gera o identificador |
| RF02 | Listar pessoas | Exibir todas as pessoas, com a quantidade de transações de cada uma |
| RF03 | Excluir pessoa | Remover pessoa e, em cascata, todas as suas transações |
| RF04 | Cadastrar transação | Criar transação respeitando as regras de negócio |
| RF05 | Listar transações | Exibir transações com os dados da pessoa associada |
| RF06 | Consultar totais por pessoa | Total de receitas, despesas e saldo de cada pessoa |
| RF07 | Consultar total geral | Consolidado de receitas, despesas e saldo líquido |
| RF08 | Filtrar transações | Filtrar a listagem por pessoa e por tipo |

### 3.2. Controle de acesso

| ID | Requisito | Descrição |
|----|-----------|-----------|
| RF10 | Registrar usuário | Criar conta com nome, e-mail e senha |
| RF11 | Autenticar usuário | Login com e-mail e senha, devolvendo token de acesso |
| RF12 | Encerrar sessão | Descartar o token no cliente e retornar à tela de autenticação |
| RF13 | Consultar usuário autenticado | Obter os dados do usuário da sessão corrente |
| RF14 | Proteger endpoints | Exigir autenticação em pessoas, transações e totais |

### 3.3. Usabilidade e operação

| ID | Requisito | Descrição |
|----|-----------|-----------|
| RF09 | Validar formulários no cliente | Feedback imediato antes do envio |
| RF15 | Exibir impacto da exclusão | Informar quantas transações serão removidas junto com a pessoa |
| RF16 | Indicador visual de proporção | Representação gráfica da relação receita/despesa |
| RF17 | Verificação de saúde | Endpoint público que reporta a disponibilidade da API |

## 4. Requisitos não funcionais

| ID | Categoria | Requisito |
|----|-----------|-----------|
| RNF01 | Persistência | Os dados sobrevivem ao encerramento da aplicação |
| RNF02 | Reprodutibilidade | O sistema sobe por completo com um único comando |
| RNF03 | Qualidade de código | Camadas separadas, nomes claros, padronização consistente |
| RNF04 | Documentação | API documentada, README com instruções, documentação de engenharia |
| RNF05 | Confiabilidade | Todas as regras validadas no servidor, independentemente do cliente |
| RNF06 | Tratamento de erros | Respostas padronizadas com códigos HTTP corretos |
| RNF07 | Usabilidade | Estados de carregamento, erro e vazio tratados explicitamente |
| RNF08 | Manutenibilidade | Regras de negócio críticas cobertas por testes automatizados |
| RNF09 | Portabilidade | Execução independente do sistema operacional |
| RNF10 | Segurança de entrada | Validação de dados e CORS restrito à origem do cliente |
| RNF11 | Segurança de credenciais | Senhas armazenadas com hash e salt; nunca em texto puro, em resposta ou em log |
| RNF12 | Gestão de sessão | Token com expiração definida; expirado resulta em retorno à autenticação |
| RNF13 | Acessibilidade | Conformidade WCAG 2.1 nível AA |
| RNF14 | Responsividade | Layout funcional de 320px a 1920px, sem rolagem horizontal |

## 5. Regras de negócio

### 5.1. Domínio financeiro

| ID | Regra |
|----|-------|
| RN01 | Identificadores são únicos e gerados automaticamente pelo sistema |
| RN02 | Uma transação só pode ser criada se a pessoa referenciada existir |
| RN03 | Pessoas menores de 18 anos podem registrar apenas despesas |
| RN04 | O tipo da transação é domínio fechado: despesa ou receita |
| RN05 | Excluir uma pessoa exclui todas as suas transações |
| RN06 | O valor da transação deve ser maior que zero; o sentido financeiro vem do tipo, não do sinal |
| RN07 | O saldo de uma pessoa é a soma das receitas menos a soma das despesas, podendo ser negativo |
| RN08 | O total geral é a soma dos totais de todas as pessoas |
| RN09 | Nome é obrigatório, com até 150 caracteres; idade é inteira entre 0 e 130 |
| RN10 | Descrição é obrigatória, com até 200 caracteres; valores têm 2 casas decimais |

### 5.2. Controle de acesso

| ID | Regra |
|----|-------|
| RN11 | O e-mail é único no sistema e armazenado normalizado em minúsculas |
| RN12 | A senha tem no mínimo 8 caracteres e é armazenada apenas como hash com salt |
| RN13 | Falha de autenticação retorna mensagem genérica, sem revelar se o e-mail existe |
| RN14 | O token de acesso expira em 8 horas; token ausente, inválido ou expirado é rejeitado |
| RN15 | Todos os endpoints de negócio exigem autenticação |
| RN16 | Os dados são compartilhados entre todos os usuários autenticados |

### 5.3. Usabilidade

| ID | Regra |
|----|-------|
| RN17 | Antes de confirmar a exclusão de uma pessoa, o sistema informa quantas transações serão removidas em conjunto |

## 6. Detalhes de implementação relevantes

Pontos que orientam decisões técnicas e evitam erros sutis:

- A verificação de maioridade ocorre no momento da criação da transação, com a idade registrada da pessoa.
- Valores monetários usam tipo decimal exato, nunca ponto flutuante binário.
- Pessoas sem transações aparecem na consulta de totais com valores zerados.
- Somas são calculadas sobre os valores originais, com arredondamento apenas na apresentação.
- A existência da pessoa é verificada antes da regra de maioridade, definindo a precedência dos erros.
- Regras de integridade são aplicadas na aplicação e reforçadas no banco de dados.

## 7. Rastreabilidade

| Requisito | Regras | Caso de uso |
|-----------|--------|-------------|
| RF01 | RN01, RN09 | UC01 |
| RF02 | RN17 | UC02 |
| RF03 | RN05 | UC03 |
| RF04 | RN02, RN03, RN06, RN10 | UC04 |
| RF05, RF08 | — | UC05 |
| RF06, RF07 | RN07, RN08 | UC06 |
| RF10 | RN11, RN12 | UC07 |
| RF11 | RN12, RN13, RN14 | UC08 |
| RF12 | — | UC09 |
| RF13 | RN14 | UC10 |
| RF14 | RN15 | UC01–UC06 |
| RF15 | RN17 | UC03 |

## 8. Fora de escopo

**Acesso:** isolamento de dados por usuário, papéis e permissões, recuperação de senha, refresh token, verificação de e-mail, autenticação em dois fatores.

**Domínio:** edição de pessoa ou transação, exclusão de transação, categorias, filtros por período, metas e orçamentos, transações recorrentes, anexos, exportação de relatórios.

**Técnico:** paginação, cache, mensageria, processamento em segundo plano, auditoria, exclusão lógica.