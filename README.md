# UniFood

O UniFood é um catálogo de comidas vendidas por alunos dentro da faculdade. Quem quer comprar encontra o produto, vê onde e quando o vendedor está atendendo e chama ele no WhatsApp. Quem vende cadastra os produtos e acompanha tudo por um painel.

Projeto Integrador IV, feito em Angular com Angular Material.

## Como acessar

**Online:** https://projeto-integrador-iv-five.vercel.app


> Importante: a aplicação ainda não tem banco de dados. As informações ficam salvas só no navegador e são apagadas quando você fecha a aba. Ao abrir de novo, o catálogo volta com os produtos de exemplo.

## Como usar

### Quero comprar

Não precisa criar conta.

1. Clique em **Catálogo** no menu para ver todos os produtos. Use **Somente disponíveis** para esconder o que está em falta.
2. Clique em **Ver detalhes** em um produto. Na página dele você vê o preço, a descrição, os **horários de atendimento** do vendedor e o local na faculdade.
3. Clique em **Chamar o vendedor no WhatsApp** para combinar a compra.
4. Já provou? Em **Avaliações**, escolha as estrelas, escreva seu nome e um comentário e clique em **Publicar**. Depois você pode **editar** ou **excluir** a sua avaliação.

### Quero vender

**1. Crie sua conta**

Clique em **Quero vender** no menu, preencha seus dados (nome, e-mail, senha, WhatsApp, nome do negócio e onde você fica na faculdade) e clique em **Cadastrar**.

**2. Entre**

Na tela de login, use o e-mail e a senha que você cadastrou.

**3. Cadastre seus produtos**

Clique em **Novo produto**, preencha nome, descrição, preço e local, adicione uma foto se quiser e clique em **Cadastrar produto**. O produto já aparece no catálogo.

**4. Gerencie seus produtos**

Em **Meus produtos** você pode:
- marcar o produto como **disponível** ou **indisponível** pela chave do card;
- clicar em **Editar** para mudar as informações;
- clicar em **Excluir** para remover o produto.

**5. Informe seus horários de atendimento**

Clique no seu nome ("Olá, ...") no canto do menu para abrir **Meu perfil**. Em **Horários de atendimento**, escolha o dia, o horário de início e fim e o local, e clique em **Adicionar**. Os horários aparecem na página dos seus produtos. Também dá para editar ou excluir cada horário.

**6. Acompanhe pelo Painel**

Clique em **Painel** no menu para ver o resumo do seu negócio:
- quantos produtos estão disponíveis;
- a nota média das suas avaliações;
- quantas avaliações você recebeu;
- quantas horas por semana você atende.

**7. Cuide da sua conta**

Em **Meu perfil** você também pode **editar seus dados**, **alterar a senha** ou **excluir a conta** (isso apaga também seus produtos e horários). Para sair, clique em **Sair**.

## Documentação

- [Diagrama de classes](docs/diagrama-de-classes.md)
