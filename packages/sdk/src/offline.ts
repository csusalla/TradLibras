export type Keyframe = {
  time: number;
  head: { pitch: number; yaw: number; roll: number };
  leftHand: { x: number; y: number; z: number };
  rightHand: { x: number; y: number; z: number };
  nmf?: { brow: number };
};

export type PoseTimeline = { fps: number; totalDuration: number; keyframes: Keyframe[] };

type CacheRecord = { caption: string; timeline: PoseTimeline; savedAt: number };

const PHRASE_DICTIONARY: Record<string, string> = {
  'bom dia': 'BOM_DIA',
  'tudo bem': 'TUDO_BEM',
};

const WORD_DICTIONARY: Record<string, string> = {
  'eu': 'EU',
  'meu': 'EU',
  'minha': 'EU',
  'nome': 'NOME',
  'oi': 'OLA',
  'olá': 'OLA',
  'ola': 'OLA',
  'bom': 'BOM',
  'dia': 'DIA',
  'tudo': 'TUDO',
  'bem': 'BEM',
};

export function normalizeText(text: string): string {
  const lower = (text || '').toLowerCase();
  const noDiacritics = lower.normalize('NFD').replace(/\p{Diacritic}+/gu, '');
  const noPunct = noDiacritics.replace(/[\p{P}\p{S}]+/gu, ' ');
  const normalized = noPunct.replace(/\s+/g, ' ').trim();
  const stop = new Set(['o','a','os','as','de','do','da','dos','das','um','uma','e','é','ser','que']);
  const filtered = normalized.split(' ').filter(t => !stop.has(t)).join(' ').trim();
  return filtered || normalized;
}

export function textToGlosses(normalized: string): string[] {
  if (!normalized) return [];
  if (PHRASE_DICTIONARY[normalized]) return [PHRASE_DICTIONARY[normalized]];
  const tokens = normalized.split(' ');
  const result: string[] = [];
  let i = 0;
  while (i < tokens.length) {
    const big = i + 1 < tokens.length ? `${tokens[i]} ${tokens[i+1]}` : '';
    if (big && PHRASE_DICTIONARY[big]) { result.push(PHRASE_DICTIONARY[big]); i += 2; continue; }
    const tok = tokens[i];
    if (WORD_DICTIONARY[tok]) result.push(WORD_DICTIONARY[tok]);
    else result.push(fingerspell(tok));
    i += 1;
  }
  return result;
}

function fingerspell(word: string): string {
  const letters = (word || '').replace(/[^a-zA-ZçÇáàâãéèêíïóôõúüñ]/g, '');
  if (!letters) return '';
  const ascii = letters.normalize('NFD').replace(/\p{Diacritic}+/gu, '').toUpperCase();
  return ascii.split('').join('-');
}

export function generatePoseTimeline(glosses: string[]): PoseTimeline {
  const fps = 30;
  const baseDuration = 1.0;
  const transition = 0.2;
  const totalDuration = glosses.length > 0 ? glosses.length * baseDuration + Math.max(0, glosses.length - 1) * transition : 0;

  const keyframes: Keyframe[] = [];
  let time = 0;
  let prevPose = {
    left: { x: -0.4, y: 1.0, z: 0.3 },
    right: { x: 0.4, y: 1.0, z: 0.3 },
    head: { pitch: 0, yaw: 0, roll: 0 },
  };

  for (let gi = 0; gi < glosses.length; gi++) {
    const gloss = glosses[gi];
    const duration = gloss.includes('-') ? 1.2 : gloss.includes('_') ? 1.4 : 1.0;
    const steps = Math.max(2, Math.floor((duration * fps) / 6));
    const seed = gi + 1;
    const targetPose = {
      left: {
        x: -0.4 + Math.sin(seed * 0.9) * 0.15,
        y: 1.0 + Math.cos(seed * 0.7) * 0.08,
        z: 0.3 + Math.sin(seed * 0.5) * 0.08,
      },
      right: {
        x: 0.4 + Math.sin(seed * 1.1) * 0.15,
        y: 1.0 + Math.cos(seed * 0.8) * 0.08,
        z: 0.3 + Math.sin(seed * 0.6) * 0.08,
      },
      head: { pitch: Math.sin(seed * 0.6) * 4, yaw: Math.cos(seed * 0.4) * 6, roll: Math.sin(seed * 0.3) * 2 },
    };

    const nmfPeak = gloss.includes('_') ? 0.8 : 0.5;
    const nmf = (a: number) => {
      const attack = Math.min(1, a * 2);
      const decay = Math.max(0, 1 - Math.max(0, a - 0.5) * 2);
      return nmfPeak * Math.min(attack, decay);
    };

    const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
    for (let i = 0; i <= steps; i++) {
      const alpha = i / steps;
      const t = time + alpha * duration;
      const leftHand = {
        x: lerp(prevPose.left.x, targetPose.left.x, alpha),
        y: lerp(prevPose.left.y, targetPose.left.y, alpha),
        z: lerp(prevPose.left.z, targetPose.left.z, alpha),
      };
      const rightHand = {
        x: lerp(prevPose.right.x, targetPose.right.x, alpha),
        y: lerp(prevPose.right.y, targetPose.right.y, alpha),
        z: lerp(prevPose.right.z, targetPose.right.z, alpha),
      };
      const nmfVal = nmf(alpha);
      const head = {
        pitch: lerp(prevPose.head.pitch, targetPose.head.pitch, alpha) + Math.sin(t * 2.0) * 1.0 + nmfVal * 2.0,
        yaw: lerp(prevPose.head.yaw, targetPose.head.yaw, alpha),
        roll: lerp(prevPose.head.roll, targetPose.head.roll, alpha),
      };
      keyframes.push({ time: parseFloat(t.toFixed(3)), head, leftHand, rightHand, nmf: { brow: parseFloat(nmfVal.toFixed(3)) } });
    }

    time += duration;
    if (gi < glosses.length - 1) {
      const transSteps = Math.max(1, Math.floor((transition * fps) / 6));
      const nextSeed = gi + 2;
      const nextPose = {
        left: {
          x: -0.4 + Math.sin(nextSeed * 0.9) * 0.15,
          y: 1.0 + Math.cos(nextSeed * 0.7) * 0.08,
          z: 0.3 + Math.sin(nextSeed * 0.5) * 0.08,
        },
        right: {
          x: 0.4 + Math.sin(nextSeed * 1.1) * 0.15,
          y: 1.0 + Math.cos(nextSeed * 0.8) * 0.08,
          z: 0.3 + Math.sin(nextSeed * 0.6) * 0.08,
        },
        head: { pitch: Math.sin(nextSeed * 0.6) * 4, yaw: Math.cos(nextSeed * 0.4) * 6, roll: Math.sin(nextSeed * 0.3) * 2 },
      };
      for (let i = 1; i <= transSteps; i++) {
        const a = i / transSteps;
        const t = time + a * transition;
        const leftHand = {
          x: lerp(targetPose.left.x, nextPose.left.x, a),
          y: lerp(targetPose.left.y, nextPose.left.y, a),
          z: lerp(targetPose.left.z, nextPose.left.z, a),
        };
        const rightHand = {
          x: lerp(targetPose.right.x, nextPose.right.x, a),
          y: lerp(targetPose.right.y, nextPose.right.y, a),
          z: lerp(targetPose.right.z, nextPose.right.z, a),
        };
        const head = {
          pitch: lerp(targetPose.head.pitch, nextPose.head.pitch, a),
          yaw: lerp(targetPose.head.yaw, nextPose.head.yaw, a),
          roll: lerp(targetPose.head.roll, nextPose.head.roll, a),
        };
        keyframes.push({ time: parseFloat(t.toFixed(3)), head, leftHand, rightHand, nmf: { brow: 0 } });
      }
      time += transition;
      prevPose = nextPose;
    } else {
      prevPose = targetPose;
    }
  }

  return { fps, totalDuration: parseFloat(totalDuration.toFixed(2)), keyframes };
}

// Simple local cache (localStorage with LRU semantics)
const CACHE_KEY = 'tradlibras_cache_v1';
const SESSION_CACHE_KEY = 'tradlibras_cache_session_v1';
const RETENTION_KEY = 'tradlibras_retention_days';
const MAX_ENTRIES = 50;

type StoredCache = {
  order: string[]; // most recent last
  items: Record<string, CacheRecord>;
};

function getRetentionDays(): number {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(RETENTION_KEY) : null;
    const v = raw != null ? parseInt(raw, 10) : 0;
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}

export function setRetentionDays(days: number) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(RETENTION_KEY, String(Math.max(0, Math.floor(days))));
  } catch {}
}

export function getCurrentRetentionDays(): number {
  return getRetentionDays();
}

function readCache(): StoredCache {
  try {
    const retention = getRetentionDays();
    const storage = retention === 0 ? sessionStorage : localStorage;
    const raw = typeof storage !== 'undefined' ? storage.getItem(retention === 0 ? SESSION_CACHE_KEY : CACHE_KEY) : null;
    if (!raw) return { order: [], items: {} };
    return JSON.parse(raw);
  } catch {
    return { order: [], items: {} };
  }
}

function writeCache(cache: StoredCache) {
  try {
    const retention = getRetentionDays();
    if (retention === 0) {
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(cache));
    } else {
      if (typeof localStorage !== 'undefined') localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
  } catch {}
}

export function cacheGet(caption: string): PoseTimeline | null {
  const c = readCache();
  const rec = c.items[caption];
  if (!rec) return null;
  const retention = getRetentionDays();
  if (retention > 0) {
    const maxAge = retention * 86400000;
    if (Date.now() - rec.savedAt > maxAge) {
      delete c.items[caption];
      c.order = c.order.filter(k => k !== caption);
      writeCache(c);
      return null;
    }
  }
  // move to end (most recent)
  c.order = c.order.filter(k => k !== caption);
  c.order.push(caption);
  writeCache(c);
  return rec.timeline;
}

export function cacheSet(caption: string, timeline: PoseTimeline) {
  const c = readCache();
  if (!c.items[caption]) {
    c.order.push(caption);
  } else {
    c.order = c.order.filter(k => k !== caption).concat(caption);
  }
  c.items[caption] = { caption, timeline, savedAt: Date.now() };
  while (c.order.length > MAX_ENTRIES) {
    const oldest = c.order.shift();
    if (oldest) delete c.items[oldest];
  }
  writeCache(c);
}

export function offlinePipeline(text: string) {
  const normalized = normalizeText(text);
  const glosses = textToGlosses(normalized);
  const caption = glosses.join(' ');
  const cached = cacheGet(caption);
  const timeline = cached || generatePoseTimeline(glosses);
  if (!cached && caption) cacheSet(caption, timeline);
  return { normalizedText: normalized, glosses, caption, timeline };
}

export function prewarmCommon() {
  const phrases = ['Bom dia', 'Tudo bem?', 'Meu nome é Ana'];
  for (const p of phrases) {
    offlinePipeline(p);
  }
}

export function wipeLocalData() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(RETENTION_KEY);
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(SESSION_CACHE_KEY);
    }
  } catch {}
}

