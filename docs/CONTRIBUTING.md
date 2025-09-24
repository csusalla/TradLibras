# 🤝 Guia de Contribuição - TradLibras

Obrigado pelo interesse em contribuir com o TradLibras! Este projeto é desenvolvido para promover acessibilidade e inclusão da comunidade surda brasileira.

## 📋 Índice

- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Process de Desenvolvimento](#processo-de-desenvolvimento)
- [Tipos de Contribuição](#tipos-de-contribuição)
- [Revisão de Código](#revisão-de-código)
- [Comunidade](#comunidade)

## 🚀 Como Contribuir

### 1. Fork e Clone
```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU-USUARIO/tradlibras.git
cd tradlibras

# Adicione o repositório original como upstream
git remote add upstream https://github.com/tradlibras/tradlibras.git
```

### 2. Configure o Ambiente
```bash
# Instale dependências
make install

# Configure variáveis de ambiente
cp .env.example .env

# Inicie o ambiente de desenvolvimento
make dev
```

### 3. Crie uma Branch
```bash
# Sempre crie branches a partir da main atualizada
git checkout main
git pull upstream main
git checkout -b feature/nome-da-feature
```

## ⚙️ Configuração do Ambiente

### Requisitos
- Node.js 18+ 
- Docker e Docker Compose
- Android Studio (para mobile)
- Git

### Setup Completo
```bash
# 1. Clone e instale
git clone https://github.com/tradlibras/tradlibras.git
cd tradlibras
make setup

# 2. Verifique se tudo está funcionando
make test
make lint

# 3. Inicie o desenvolvimento
make dev
```

### Verificação da Instalação
- ✅ Web app em http://localhost:3000
- ✅ API em http://localhost:8000
- ✅ Docs da API em http://localhost:8000/api
- ✅ Testes passando: `make test`

## 🎨 Padrões de Código

### TypeScript/JavaScript
```typescript
// ✅ Bom
interface TranslationOptions {
  language: 'pt-BR' | 'en-US';
  voice: boolean;
  avatar: AvatarType;
}

const translateToLibras = async (
  text: string, 
  options: TranslationOptions
): Promise<TranslationResult> => {
  // Implementação
};

// ❌ Evitar
function translate(txt, opts) {
  // Sem tipos, nomes ruins
}
```

### Kotlin (Mobile)
```kotlin
// ✅ Bom
class TranslateViewModel @Inject constructor(
    private val translateRepository: TranslateRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(TranslateUiState())
    val uiState: StateFlow<TranslateUiState> = _uiState.asStateFlow()
    
    fun translateText(text: String) {
        viewModelScope.launch {
            // Implementação
        }
    }
}

// ❌ Evitar
class VM {
    var state = mutableStateOf("")
    // Sem injeção de dependência, nomes ruins
}
```

### Estrutura de Arquivos
```
# ✅ Organização clara
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes de UI básicos
│   └── features/        # Componentes específicos
├── hooks/               # React hooks customizados
├── services/            # Integrações com APIs
├── types/              # Definições de tipos
└── utils/              # Utilitários

# ❌ Evitar
src/
├── stuff/
├── misc/
└── index.js            # Tudo em um arquivo
```

## 🔄 Processo de Desenvolvimento

### 1. Análise e Planejamento
- [ ] Discuta a feature/bug na issue correspondente
- [ ] Verifique se já existe trabalho similar em andamento
- [ ] Defina critérios de aceitação claros

### 2. Desenvolvimento
```bash
# Inicie sempre com testes
make test:watch

# Desenvolva com linting ativo
make lint

# Commits frequentes e descritivos
git commit -m "feat(web): add voice recording button

- Add microphone button to translation interface
- Integrate with browser's MediaRecorder API
- Handle permissions and error states
- Add visual feedback during recording

Closes #123"
```

### 3. Testes
```bash
# Execute todos os testes
make test

# Testes específicos por área
make test:web
make test:api
make test:sdk
make test:mobile
```

### 4. Pull Request
- [ ] Todos os testes passando
- [ ] Linting sem erros
- [ ] Documentação atualizada
- [ ] Screenshots/GIFs para mudanças visuais
- [ ] Referência à issue relacionada

## 🛠️ Tipos de Contribuição

### 🐛 Bug Reports
```markdown
**Bug Report**

**Descrição do Bug**
Breve descrição do problema.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '....'
3. Role até '....'
4. Veja o erro

**Comportamento Esperado**
O que você esperava que acontecesse.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente**
- OS: [e.g. iOS/Android/Windows]
- Navegador: [e.g. chrome, safari]
- Versão: [e.g. 22]
```

### ✨ Feature Requests
```markdown
**Feature Request**

**Problema que Resolve**
Descrição clara do problema ou necessidade.

**Solução Proposta**
Descrição da solução que você gostaria.

**Alternativas Consideradas**
Outras soluções que você considerou.

**Contexto Adicional**
Qualquer contexto adicional sobre a feature.
```

### 📝 Contribuições de Código

#### Commits Semânticos
```bash
# Formato: tipo(escopo): descrição

# Tipos:
feat      # Nova funcionalidade
fix       # Correção de bug
docs      # Apenas documentação
style     # Formatação, sem mudança lógica
refactor  # Refatoração sem adicionar feature ou corrigir bug
test      # Adicionar ou corrigir testes
chore     # Tarefas de build, deps, etc.

# Exemplos:
git commit -m "feat(sdk): add voice recording capability"
git commit -m "fix(api): correct translation confidence calculation"
git commit -m "docs(readme): update installation instructions"
```

#### Pull Request Template
```markdown
## 📝 Descrição
Breve descrição das mudanças.

## 🔗 Issue Relacionada
Fixes #(número da issue)

## 📋 Tipo de Mudança
- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova feature (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação

## 🧪 Como Testar
1. Execute `make dev`
2. Vá para a página X
3. Clique no botão Y
4. Verifique que Z acontece

## 📷 Screenshots/GIFs
(Se aplicável)

## ✅ Checklist
- [ ] Meu código segue os padrões do projeto
- [ ] Fiz self-review do código
- [ ] Comentei partes complexas
- [ ] Adicionei/atualizei testes
- [ ] Testes passam localmente
- [ ] Atualizei documentação
```

## 👁️ Revisão de Código

### Para Autores
- ✅ Código limpo e comentado
- ✅ Testes adicionados/atualizados
- ✅ Documentação atualizada
- ✅ Screenshots para mudanças visuais
- ✅ Performance considerada

### Para Revisores
- 🔍 **Funcionalidade**: O código faz o que deveria?
- 🏗️ **Arquitetura**: Está bem estruturado?
- 🧪 **Testes**: Há cobertura adequada?
- 📚 **Documentação**: Está clara e atualizada?
- 🚀 **Performance**: Não introduz regressões?
- 🔒 **Segurança**: Não há vulnerabilidades?

### Feedback Construtivo
```markdown
# ✅ Bom feedback
Sugestão: Poderíamos extrair esta lógica para um hook customizado 
para melhor reutilização. O que você acha?

# ✅ Ainda melhor
Sugestão: [Aqui](link) para um exemplo de como implementar.

# ❌ Evitar
Isso está errado. Refaça.
```

## 👥 Comunidade

### Canais de Comunicação
- **GitHub Issues**: Bugs, features, discussões técnicas
- **GitHub Discussions**: Perguntas gerais, ideias
- **Email**: contato@tradlibras.com.br

### Código de Conduta
- 🤝 Seja respeitoso e inclusivo
- 💬 Comunique-se de forma clara e construtiva
- 🎯 Foque no problema, não na pessoa
- 🌟 Celebre as contribuições dos outros
- 🆘 Peça ajuda quando precisar

### Reconhecimento
- Contributors são reconhecidos no README
- Contribuições significativas recebem menção especial
- Oportunidades de apresentar trabalho em events

## 🎯 Áreas Que Precisam de Ajuda

### 🔥 Alta Prioridade
- [ ] Melhorar precisão do ASR
- [ ] Otimizar performance do avatar 3D
- [ ] Adicionar mais sinais ao dicionário
- [ ] Testes end-to-end
- [ ] Documentação para desenvolvedores

### 💡 Médias Prioridade
- [ ] Interface para upload de novos sinais
- [ ] Sistema de feedback dos usuários
- [ ] Métricas de uso e analytics
- [ ] Suporte a mais idiomas
- [ ] Modo offline para mobile

### 🌟 Projetos Especiais
- [ ] Plugin para WordPress/Drupal
- [ ] Extensão para browsers
- [ ] Integração com plataformas de educação
- [ ] API para desenvolvedores terceiros

## 📚 Recursos Úteis

### Documentação Técnica
- [ADR-0001: Arquitetura](./adrs/ADR-0001-arquitetura.md)
- [API Documentation](http://localhost:8000/api)
- [Three.js Guide](https://threejs.org/docs/)
- [Libras Reference](https://www.libras.org.br)

### Ferramentas de Desenvolvimento
- [ESLint Config](.eslintrc.json)
- [Prettier Config](.prettierrc)
- [TypeScript Config](tsconfig.json)
- [Docker Compose](docker-compose.yml)

---

**Lembrete**: Este é um projeto social com impacto real na vida das pessoas. Cada linha de código contribui para um mundo mais acessível e inclusivo! 🌍❤️

*Dúvidas? Abra uma [Discussion](https://github.com/tradlibras/tradlibras/discussions) ou envie um email para contato@tradlibras.com.br*