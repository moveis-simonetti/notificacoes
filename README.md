# Projeto de Notificações

Este repositório contém o serviço de notificações, configurado para rodar facilmente com Docker e Makefile.

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Make](https://www.gnu.org/software/make/) (Geralmente já instalado em sistemas Linux/Unix)

## Configuração Inicial

1. **Clone o repositório:**

   ```bash
   git clone git@github.com:moveis-simonetti/notificacoes.git
   cd notificacoes
   ```

2. **Configure as variáveis de ambiente:**

   Copie o arquivo de exemplo `.env.dist` para `.env`:

   ```bash
   cp .env.dist .env
   ```

   Edite o arquivo `.env` conforme necessário para o seu ambiente local. As configurações padrão geralmente funcionam para desenvolvimento local com Docker.

## Como Rodar o Projeto

### Primeira Execução (Setup)

Se você acabou de clonar o repositório e nunca rodou o projeto antes, utilize o comando de setup. Ele fará toda a configuração inicial necessária:

```bash
make setup
```

Este comando executa os seguintes passos:

1.  **Configura Aliases:** Adiciona o domínio `notificacoes.test` ao seu `/etc/hosts` (requer senha de sudo).
2.  **Cria .env:** Copia o arquivo `.env.dist` para `.env` (se não existir).
3.  **Build Images:** Constrói as imagens Docker do projeto.
4.  **Inicia o Projeto:** Sobe os containers e roda as migrações.

### Execução Diária

Para iniciar o projeto no dia a dia (após já ter feito o setup inicial), utilize:

```bash
make up
```

Este comando é ideal para sua rotina de desenvolvimento, pois ele:

1.  Sobe os containers do Docker em background.
2.  Instala/Atualiza as dependências do Node.js (`npm install`).
3.  Executa as migrações do banco de dados pendentes (`prisma migrate dev`).

## Serviços e Portas

O `docker-compose.yml` define os seguintes serviços:

- **App (Node.js):** Roda na porta `3000`.
- **Database (MySQL):** Acessível externamente na porta `3309` (internamente `3306`).
- **Redis:** Acessível externamente na porta definida em `REDIS_PORT` (padrão `6379`) ou `6389`.

## Estrutura do Projeto

- `src/`: Código fonte da aplicação.
- `prisma/`: Esquemas e migrações do banco de dados.
- `cli/`: Scripts utilitários de linha de comando.
- `docker-compose.yml`: Definição dos serviços Docker.
- `Makefile`: Atalhos para comandos de desenvolvimento.

## Comandos Disponíveis (Makefile)

O projeto inclui um `Makefile` para facilitar tarefas comuns. Você pode ver a lista completa de comandos rodando:

```bash
make help
```

Alguns dos comandos mais utilizados:

- `make setup`: Configura o projeto do zero (aliases, .env, build, up).
- `make up`: Inicia o projeto (containers, install, migrations).
- `make docker-up`: Sobe apenas os containers Docker.
- `make npm-install`: Instala dependências do Node.js.
- `make prisma-diff`: Roda as migrações do banco de dados.
- `make studio`: Abre o Prisma Studio.

## Prisma Studio

O Prisma Studio é uma interface visual para o seu banco de dados. Para acessá-lo:

1. Execute o comando:
   ```bash
   make studio
   ```
2. Acesse no navegador: [http://localhost:5555](http://localhost:5555)

Isso permite visualizar e editar os dados do banco de forma fácil.

## Solução de Problemas

**Erro de conexão com o banco de dados:**
Certifique-se de que o container `db` está saudável (`healthy`). Você pode verificar com:

```bash
docker compose ps
```

Se o banco estiver iniciando, aguarde alguns segundos e tente rodar `make prisma-diff` novamente.
