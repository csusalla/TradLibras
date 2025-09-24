# TradLibras

Plataforma completa de tradução para Libras (Língua Brasileira de Sinais) com reconhecimento automático de fala (ASR) e geração de sinais em 3D.

## 🏗️ Arquitetura do Monorepo

```
tradlibras/
├── apps/
│   ├── web/          # Interface web (Next.js + Three.js)
│   └── mobile/       # App Android (Kotlin + Jetpack Compose)
├── packages/
│   └── sdk/          # SDK TypeScript do widget
├── services/
│   └── api/          # API backend (NestJS)
├── models/           # Pipelines de ML (stubs)
├── infra/            # Docker e CI/CD
└── docs/             # Documentação e ADRs
```

## 🚀 Como Rodar Localmente

### Opção 1: Com Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/tradlibras.git
cd tradlibras

# Inicie todos os serviços
make dev
```

### Opção 2: Desenvolvimento Local (sem Docker)

```bash
# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o desenvolvimento
npm run dev:local
```

## 📋 Scripts Disponíveis

```bash
make dev      # Inicia ambiente de desenvolvimento
make build    # Builda todos os projetos
make test     # Executa todos os testes
make run      # Roda em modo produção
make lint     # Executa linting
make format   # Formata o código
make clean    # Limpa builds e cache
```

## 🧩 Componentes

### Web App
- **URL**: http://localhost:3000
- **Tech**: Next.js, TypeScript, Three.js, Tailwind CSS
- **Features**: Player 3D, interface de tradução, integração com widget

### Mobile App
- **Tech**: Android, Kotlin, Jetpack Compose, Hilt
- **Features**: ASR nativo, câmera, sincronização offline

### Widget SDK
- **Package**: `@tradlibras/sdk`
- **Instalação**: `npm install @tradlibras/sdk`
- **UMD**: `<script src="https://unpkg.com/@tradlibras/sdk/dist/tradlibras.min.js"></script>`

### API
- **URL**: http://localhost:8000
- **Tech**: NestJS, TypeScript, PostgreSQL
- **Docs**: http://localhost:8000/api

## 🔌 Como embutir o widget em uma página HTML simples

Exemplo mínimo usando o build UMD do SDK:

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Widget TradLibras</title>
    <script src="/node_modules/@tradlibras/sdk/dist/tradlibras.min.js"></script>
    <script>
      // registra o web component
      window.Tradlibras && window.Tradlibras.registerWidget && window.Tradlibras.registerWidget();
    </script>
  </head>
  <body>
    <libras-translator-widget api-url="http://localhost:8000"></libras-translator-widget>
  </body>
  </html>
```

Com bundlers modernos, importe e registre:

```ts
import { registerWidget } from '@tradlibras/sdk';
registerWidget();
```

## 🧪 Testes

```bash
# Todos os testes
npm test

# Por projeto
npm run test:web
npm run test:mobile  
npm run test:sdk
npm run test:api
```

## 📚 Documentação

- [Arquitetura (ADR-0001)](./docs/adrs/ADR-0001-arquitetura.md)
- [Guia de Contribuição](./docs/CONTRIBUTING.md)
- [Políticas de Privacidade](./docs/PRIVACY.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🏢 Equipe

- **Core Team**: TradLibras Development Team
- **Contato**: contato@tradlibras.com.br

---

Desenvolvido com ❤️ para a comunidade surda brasileira