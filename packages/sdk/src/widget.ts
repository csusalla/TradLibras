export class LibrasTranslatorWidget extends HTMLElement {
  private shadow: ShadowRoot;
  private apiUrl: string;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.apiUrl = this.getAttribute('api-url') || 'http://localhost:8000';
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    this.shadow.innerHTML = `
      <style>
        :host { display: block; font-family: sans-serif; }
        .card { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; border-radius: 12px; overflow: hidden; }
        .header { padding: 8px 12px; background: rgba(255,255,255,0.1); }
        .body { padding: 12px; }
        textarea { width: 100%; height: 80px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 8px; resize: none; }
        .row { display: flex; gap: 8px; margin-top: 8px; }
        button { flex: 1; background: #22c55e; border: none; padding: 8px; border-radius: 8px; color: #fff; cursor: pointer; }
        .mic { background: #3b82f6; }
        .output { margin-top: 8px; background: rgba(0,0,0,0.2); height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: rgba(255,255,255,0.8); }
      </style>
      <div class="card">
        <div class="header"><strong>TradLibras</strong></div>
        <div class="body">
          <textarea id="input" placeholder="Digite ou fale o texto para traduzir..."></textarea>
          <div class="row">
            <button class="mic" id="mic">🎤 Gravar</button>
            <button id="translate">▶️ Traduzir</button>
          </div>
          <div id="output" class="output">Avatar aparecerá aqui</div>
        </div>
      </div>
    `;

    const input = this.shadow.getElementById('input') as HTMLTextAreaElement;
    const out = this.shadow.getElementById('output') as HTMLDivElement;
    const btn = this.shadow.getElementById('translate') as HTMLButtonElement;
    btn.addEventListener('click', async () => {
      out.textContent = 'Traduzindo...';
      const res = await fetch(`${this.apiUrl}/translate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: input.value })
      });
      const data = await res.json();
      out.textContent = data.caption || 'Sem resultado';
    });
  }
}

export function registerWidget() {
  if (!customElements.get('libras-translator-widget')) {
    customElements.define('libras-translator-widget', LibrasTranslatorWidget);
  }
}

