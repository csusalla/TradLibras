export class LibrasTranslatorWidget extends HTMLElement {
  private shadow: ShadowRoot;
  private apiUrl: string;
  private lang: string = 'pt-BR';
  private autoplay: boolean = false;
  private theme: 'light' | 'dark' = 'dark';
  private size: 'small' | 'medium' | 'large' = 'medium';
  private translateDebounce?: number;

  static get observedAttributes() {
    return ['api-url', 'lang', 'autoplay', 'theme', 'size'];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.apiUrl = this.getAttribute('api-url') || 'http://localhost:8000';
    this.lang = (this.getAttribute('lang') as string) || 'pt-BR';
    this.autoplay = this.hasAttribute('autoplay') || this.getAttribute('autoplay') === 'true';
    this.theme = (this.getAttribute('theme') as any) || 'dark';
    this.size = (this.getAttribute('size') as any) || 'medium';
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    switch (name) {
      case 'api-url':
        this.apiUrl = newValue || this.apiUrl;
        break;
      case 'lang':
        this.lang = (newValue as string) || 'pt-BR';
        break;
      case 'autoplay':
        this.autoplay = newValue === '' || newValue === 'true';
        break;
      case 'theme':
        this.theme = (newValue as any) === 'light' ? 'light' : 'dark';
        break;
      case 'size':
        this.size = (newValue as any) || 'medium';
        break;
    }
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  private placeholder() {
    return this.lang === 'pt-BR' ? 'Digite ou fale o texto para traduzir...' : 'Type or speak text to translate...';
  }

  private render() {
    const isLight = this.theme === 'light';
    const sizeStyle = this.size === 'small' ? 'max-width: 320px' : this.size === 'large' ? 'max-width: 640px' : 'max-width: 480px';
    this.shadow.innerHTML = `
      <style>
        :host { display: block; font-family: sans-serif; ${sizeStyle}; }
        .card { background: ${isLight ? 'linear-gradient(135deg,#e2e8f0,#f8fafc)' : 'linear-gradient(135deg, #2563eb, #7c3aed)'}; color: ${isLight ? '#0f172a' : 'white'}; border-radius: 12px; overflow: hidden; border: 1px solid ${isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)'} }
        .header { padding: 8px 12px; background: ${isLight ? '#f1f5f9' : 'rgba(255,255,255,0.1)'}; }
        .body { padding: 12px; display:flex; flex-direction: column; gap: 8px; }
        textarea { width: 100%; height: 80px; background: ${isLight ? '#ffffff' : 'rgba(255,255,255,0.2)'}; color: ${isLight ? '#0f172a' : 'white'}; border: 1px solid ${isLight ? '#cbd5e1' : 'rgba(255,255,255,0.3)'}; border-radius: 8px; padding: 8px; resize: none; }
        .row { display: flex; gap: 8px; margin-top: 8px; }
        button { flex: 1; background: #22c55e; border: none; padding: 8px; border-radius: 8px; color: #fff; cursor: pointer; }
        .mic { background: #3b82f6; }
        .output { margin-top: 8px; background: ${isLight ? '#eef2ff' : 'rgba(0,0,0,0.2)'}; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: ${isLight ? '#334155' : 'rgba(255,255,255,0.8)'} }
        .consent { display:flex; align-items: center; gap: 8px; font-size: 12px; }
        .row2 { display:flex; gap: 8px; align-items:center; }
        select, input[type=number] { padding: 4px 6px; border-radius: 6px; border: 1px solid ${isLight ? '#cbd5e1' : 'rgba(255,255,255,0.3)'}; background: ${isLight ? '#fff' : 'rgba(255,255,255,0.15)'}; color: inherit; }
        .danger { background: #ef4444; }
      </style>
      <div class="card">
        <div class="header"><strong>TradLibras</strong></div>
        <div class="body">
          <label class="consent">
            <input id="consent" type="checkbox" />
            <span>${this.lang === 'pt-BR' ? 'Consinto o uso do microfone para reconhecimento de voz' : 'I consent to microphone use for speech recognition'}</span>
          </label>
          <div class="row2">
            <label>${this.lang === 'pt-BR' ? 'Retenção (dias):' : 'Retention (days):'}
              <input id="retention" type="number" min="0" step="1" value="0" style="width:80px" />
            </label>
            <button id="wipe" class="danger" style="flex:0">${this.lang === 'pt-BR' ? 'Excluir meus dados' : 'Delete my data'}</button>
          </div>
          <textarea id="input" placeholder="${this.placeholder()}"></textarea>
          <div class="row">
            <button class="mic" id="mic">🎤 ${this.lang === 'pt-BR' ? 'Gravar' : 'Record'}</button>
            <button id="translate">▶️ ${this.lang === 'pt-BR' ? 'Traduzir' : 'Translate'}</button>
          </div>
          <div id="output" class="output">${this.lang === 'pt-BR' ? 'Avatar aparecerá aqui' : 'Avatar will appear here'}</div>
        </div>
      </div>
    `;

    const input = this.shadow.getElementById('input') as HTMLTextAreaElement;
    const out = this.shadow.getElementById('output') as HTMLDivElement;
    const btn = this.shadow.getElementById('translate') as HTMLButtonElement;
    // consent + retention wiring
    const consent = this.shadow.getElementById('consent') as HTMLInputElement;
    const retention = this.shadow.getElementById('retention') as HTMLInputElement;
    const wipe = this.shadow.getElementById('wipe') as HTMLButtonElement;
    import('./offline').then(({ setRetentionDays, getCurrentRetentionDays, wipeLocalData, prewarmCommon }) => {
      try { retention.value = String(getCurrentRetentionDays()); } catch {}
      retention.addEventListener('change', () => {
        const days = Math.max(0, Math.floor(parseInt(retention.value || '0', 10) || 0));
        setRetentionDays(days);
        prewarmCommon();
      });
      wipe.addEventListener('click', () => {
        wipeLocalData();
        out.textContent = this.lang === 'pt-BR' ? 'Dados locais excluídos' : 'Local data deleted';
      });
    });

    btn.addEventListener('click', async () => {
      await this.doTranslate(input, out);
    });

    if (this.autoplay) {
      input.addEventListener('input', () => {
        if (this.translateDebounce) window.clearTimeout(this.translateDebounce);
        this.translateDebounce = window.setTimeout(() => this.doTranslate(input, out), 500);
      });
    }
  }

  private async doTranslate(input: HTMLTextAreaElement, out: HTMLDivElement) {
    out.textContent = this.lang === 'pt-BR' ? 'Traduzindo...' : 'Translating...';
    try {
      // prefer online; fallback to offline
      if (navigator.onLine) {
        const res = await fetch(`${this.apiUrl}/translate`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: input.value, language: this.lang })
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        out.textContent = data.caption || (this.lang === 'pt-BR' ? 'Sem resultado' : 'No result');
        try {
          const glosses = (data.glosses || []).map((g: any) => g.gloss);
          const res2 = await fetch(`${this.apiUrl}/sign/generate`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ glosses })
          });
          if (res2.ok) {
            // could render a tiny 2D animation here; for now we just cache offline
            const timeline = await res2.json();
            const { cacheSet } = await import('./offline');
            if (data.caption) cacheSet(data.caption, timeline);
          }
        } catch {}
        return;
      }
      // offline fallback
      const { offlinePipeline } = await import('./offline');
      const outp = offlinePipeline(input.value);
      out.textContent = outp.caption || (this.lang === 'pt-BR' ? 'Sem resultado' : 'No result');
    } catch (e) {
      const { offlinePipeline } = await import('./offline');
      const outp = offlinePipeline(input.value);
      out.textContent = outp.caption || (this.lang === 'pt-BR' ? 'Sem resultado' : 'No result');
    }
  }
}

export function registerWidget() {
  if (!customElements.get('libras-translator-widget')) {
    customElements.define('libras-translator-widget', LibrasTranslatorWidget);
  }
}

