# 🐾 Patas Perdidas

Sistema web para gestão de ONGs de proteção animal, facilitando o cadastro de organizações, busca de animais perdidos e processo de adoção.

## 📋 Sobre o Projeto

Patas Perdidas é uma plataforma desenvolvida como parte do curso de Desenvolvimento de Sistemas do SENAC, com o objetivo de conectar ONGs de proteção animal, tutores que perderam seus pets e pessoas interessadas em adotar animais.

## ✨ Funcionalidades Planejadas

- 👤 **Login**: Sistema de autenticação de usuários
- 🏠 **Adoção de Animais**: Plataforma para divulgar animais disponíveis para adoção
- 🔍 **Busca de Animais Perdidos**: Sistema para reportar e encontrar pets desaparecidos
- 💝 **Apoiar**: Formas de contribuir com a causa animal

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript servidor
- **Express 5.1.0** - Framework web minimalista e flexível
- **Sequelize 6.37.7** - ORM para Node.js com suporte a MySQL
- **MySQL2 3.15.3** - Driver MySQL para Node.js
- **JWT (jsonwebtoken)** - Autenticação baseada em tokens
- **CORS 2.8.5** - Middleware para requisições cross-origin
- **dotenv 17.2.3** - Gerenciamento de variáveis de ambiente
- **Nodemon 3.1.11** - Reinicialização automática em desenvolvimento

## 📁 Estrutura do Projeto

```
petz-api/
├── src/
│   ├── config/
│   │   └── db.js                  # Configuração Sequelize + MySQL
│   ├── database/
│   │   ├── index.js               # Carregamento de modelos
│   │   ├── migrations/            # Migrações do banco
│   │   └── seeders/               # Seeds para dados iniciais
│   ├── models/
│   │   ├── User.js                # Modelo de usuário
│   │   └── Pet.js                 # Modelo de pet
│   ├── controllers/
│   │   ├── auth.controller.js     # Lógica de autenticação
│   │   ├── users.controller.js    # Lógica de usuários
│   │   └── pets.controller.js     # Lógica de pets
│   ├── routes/
│   │   ├── auth.routes.js         # Rotas de login/register
│   │   ├── users.routes.js        # Rotas de usuários (CRUD)
│   │   └── pets.routes.js         # Rotas de pets (CRUD)
│   ├── services/
│   │   ├── auth.service.js        # Serviços de autenticação
│   │   ├── users.service.js       # Serviços de usuários
│   │   └── pets.service.js        # Serviços de pets
│   ├── middlewares/
│   │   ├── auth.middleware.js     # Validação de JWT
│   │   └── error.middleware.js    # Tratamento de erros
│   ├── utils/
│   │   ├── generateToken.js       # Geração de JWT
│   │   └── hashPassword.js        # Hash de senhas
│   ├── app.js                     # Configuração Express
│   └── server.js                  # Inicialização do servidor
├── .env                           # Variáveis de ambiente
├── package.json                   # Dependências
└── README.md                      # Este arquivo
```

## 💻 Como Executar

### Pré-requisitos

- **Node.js 18+**
- **npm, yarn, pnpm ou bun**
- **MySQL 5.7+** (ou MariaDB)

### Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/rodrigo749/petz-api.git
cd petz-api
```

2. **Instale as dependências:**

```bash
npm install
```


```

4. **Inicie o servidor:**

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 📦 Scripts Disponíveis

- `npm start` - Servidor de produção
- `npm run dev` - Servidor de desenvolvimento com Nodemon (recarregamento automático)
- `npm test` - Executar testes (a configurar)

## 🔑 Endpoints da API

### Autenticação

- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de novo usuário

### Usuários

- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:id` - Obter usuário específico
- `PUT /api/users/:id` - Atualizar usuário (autenticado)
- `DELETE /api/users/:id` - Deletar usuário (autenticado)

### Pets

- `GET /api/pets` - Listar todos os pets
- `GET /api/pets/:id` - Obter pet específico
- `POST /api/pets` - Criar novo pet (autenticado)
- `PUT /api/pets/:id` - Atualizar pet (autenticado)
- `DELETE /api/pets/:id` - Deletar pet (autenticado)

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. 

Para acessar rotas protegidas, inclua o token no header:

```bash
Authorization: Bearer <seu_token_aqui>
```

## 🏗️ Arquitetura

O projeto segue o padrão **MVC (Model-View-Controller)** com camada de serviços:

- **Models**: Definem a estrutura dos dados
- **Controllers**: Lógica de requisição/resposta HTTP
- **Services**: Lógica de negócio
- **Routes**: Definição de endpoints
- **Middlewares**: Processamento de requisições






