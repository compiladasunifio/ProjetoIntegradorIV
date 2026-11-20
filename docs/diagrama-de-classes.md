# Diagrama de classes – UniFood

O UniFood é um catálogo onde alunos que vendem comida na faculdade divulgam seus produtos. O cliente encontra o produto, vê onde e quando o vendedor atende e entra em contato pelo WhatsApp.

O sistema tem 4 entidades: **Vendedor**, **Produto**, **Avaliação** e **Horário de atendimento**.

![Diagrama de classes](diagrama-de-classes.png)

<details>
<summary>Código do diagrama (Mermaid)</summary>

```mermaid
classDiagram
    direction LR

    class Vendedor {
        +number id
        +string nome
        +string email
        +string senhaHash
        +string telefone
        +string nomeNegocio
        +string localizacao
    }

    class Produto {
        +number id
        +string nome
        +string descricao
        +number preco
        +string imagemUrl
        +boolean disponivel
        +string localizacao
        +number vendedorId
    }

    class Avaliacao {
        +number id
        +number produtoId
        +string autorNome
        +number nota
        +string comentario
        +string data
    }

    class HorarioAtendimento {
        +number id
        +number vendedorId
        +string dia
        +string inicio
        +string fim
        +string local
    }

    Vendedor "1" *-- "0..*" Produto : vende
    Vendedor "1" *-- "0..*" HorarioAtendimento : atende em
    Produto "1" *-- "0..*" Avaliacao : recebe
```

</details>

## Entidades

| Entidade | O que representa | Quem cadastra, edita e exclui |
|---|---|---|
| **Vendedor** | Aluno que vende na faculdade. Faz login com e-mail e senha. | O próprio vendedor (tela de cadastro e página Meu perfil) |
| **Produto** | Item à venda, com preço, foto e se está disponível. | O vendedor dono do produto (Novo produto e Meus produtos) |
| **Avaliacao** | Nota de 1 a 5 e comentário deixados por um visitante sobre um produto. | O visitante que escreveu a avaliação (página do produto) |
| **HorarioAtendimento** | Dia, horário e local em que o vendedor atende na faculdade. | O vendedor dono do horário (página Meu perfil) |

## Relacionamentos

| Relacionamento | Multiplicidade | Significado |
|---|---|---|
| Vendedor → Produto | 1 para 0..* | Um vendedor tem vários produtos; cada produto pertence a um vendedor (`vendedorId`). |
| Vendedor → HorarioAtendimento | 1 para 0..* | Um vendedor tem vários horários; cada horário pertence a um vendedor (`vendedorId`). |
| Produto → Avaliacao | 1 para 0..* | Um produto recebe várias avaliações; cada avaliação é de um produto (`produtoId`). |

Os três relacionamentos são de **composição** (losango preenchido): a parte não existe sem o dono. Por isso, excluir a conta do vendedor apaga os produtos e os horários dele, e excluir um produto apaga as avaliações dele.

## Observações

- A senha não é guardada: o sistema guarda só o hash dela (`senhaHash`).
- O produto também guarda uma cópia do nome do negócio e do telefone do vendedor para mostrar no catálogo. Esses campos não aparecem no diagrama porque vêm do Vendedor.
- O Painel do vendedor não é uma entidade: ele calcula os indicadores a partir de Produto, Avaliacao e HorarioAtendimento.
