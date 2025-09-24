# Models - Pipelines de Machine Learning

Este diretório contém as interfaces e stubs para os modelos de Machine Learning utilizados no TradLibras.

## 🧠 Componentes

### ASR (Automatic Speech Recognition)
- **Função**: Converter áudio em texto
- **Tecnologias recomendadas**: Whisper, wav2vec2, Vosk
- **Interface**: `interfaces/asr.interface.ts`
- **Stub**: `stubs/asr.stub.ts`

### NLU (Natural Language Understanding)
- **Função**: Processar e compreender o texto em português
- **Tecnologias recomendadas**: spaCy, transformers, BERT
- **Interface**: `interfaces/nlu.interface.ts`
- **Stub**: `stubs/nlu.stub.ts`

### Sign Generator
- **Função**: Gerar animações 3D dos sinais de Libras
- **Tecnologias recomendadas**: MediaPipe, OpenPose, Three.js
- **Interface**: `interfaces/sign-generator.interface.ts`
- **Stub**: `stubs/sign-generator.stub.ts`

## 🔧 Como Conectar Modelos Reais

### 1. ASR - Integração com Whisper

```python
# Exemplo de integração com OpenAI Whisper
import whisper

class WhisperASR(ASRInterface):
    def __init__(self):
        self.model = whisper.load_model("large-v3")
    
    def transcribe(self, audio_path: str) -> ASRResult:
        result = self.model.transcribe(audio_path, language="pt")
        return ASRResult(
            text=result["text"],
            confidence=result.get("confidence", 0.9),
            language="pt-BR"
        )
```

### 2. NLU - Processamento com spaCy

```python
# Exemplo de pipeline NLU
import spacy

class LibrasNLU(NLUInterface):
    def __init__(self):
        self.nlp = spacy.load("pt_core_news_lg")
    
    def process(self, text: str) -> NLUResult:
        doc = self.nlp(text)
        entities = [(ent.text, ent.label_) for ent in doc.ents]
        tokens = [{"text": token.text, "pos": token.pos_} for token in doc]
        
        return NLUResult(
            entities=entities,
            tokens=tokens,
            intent=self.classify_intent(text)
        )
```

### 3. Sign Generator - Animações 3D

```typescript
// Exemplo de gerador de sinais
class SignGenerator implements SignGeneratorInterface {
    private loader: GLTFLoader;
    private mixer: THREE.AnimationMixer;
    
    async generateSign(word: string): Promise<SignData> {
        const signModel = await this.loadSignModel(word);
        const animation = await this.createAnimation(signModel);
        
        return {
            id: `sign_${word}`,
            word,
            animation: animation.toJSON(),
            duration: animation.duration,
            metadata: { type: '3d', format: 'gltf' }
        };
    }
}
```

## 📊 Performance e Otimização

### Métricas Recomendadas
- **ASR**: WER (Word Error Rate) < 5%
- **NLU**: Precisão > 90%
- **Sign Generator**: Latência < 500ms por sinal

### Otimizações
1. **Caching**: Cache de sinais frequentes
2. **Batch Processing**: Processamento em lote
3. **Model Quantization**: Redução do tamanho dos modelos
4. **GPU Acceleration**: Usar CUDA quando disponível

## 🔄 Pipeline Orquestrada

```typescript
export class TradLibrasPipeline {
    constructor(
        private asr: ASRInterface,
        private nlu: NLUInterface,
        private signGenerator: SignGeneratorInterface
    ) {}
    
    async processAudioToSigns(audioData: Buffer): Promise<SignData[]> {
        // 1. Converter áudio em texto
        const asrResult = await this.asr.transcribe(audioData);
        
        // 2. Processar texto com NLU
        const nluResult = await this.nlu.process(asrResult.text);
        
        // 3. Gerar sinais baseados no processamento
        const signs = await this.signGenerator.generateSequence(nluResult);
        
        return signs;
    }
}
```

## 📝 TODO - Próximos Passos

- [ ] Implementar modelos reais substituindo stubs
- [ ] Adicionar sistema de cache inteligente
- [ ] Implementar métricas de performance
- [ ] Criar pipeline de treinamento contínuo
- [ ] Adicionar suporte a múltiplos idiomas
- [ ] Implementar feedback loop para melhoria dos modelos