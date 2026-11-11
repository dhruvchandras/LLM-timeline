export const GROUPS = {
  MAJOR: 'major',
  CHINESE: 'chinese',
  OTHER_US: 'other-us',
  ROW: 'row',
  DECISION: 'decision',
};

export const GROUP_META = {
  major:      { label: 'Major Labs',          color: '#4fd1c5', order: 0 },
  chinese:    { label: 'Chinese Labs',         color: '#f43f5e', order: 1 },
  'other-us': { label: 'Other US Labs',        color: '#a78bfa', order: 2 },
  row:        { label: 'Rest-of-World Labs',   color: '#fbbf24', order: 3 },
  decision:   { label: 'Independent decision / classifier models', color: '#60a5fa', order: 4 },
};

export const PROVIDER_META = {
  // Major Labs
  openai:     { label: 'OpenAI',     shortLabel: 'OpenAI',     color: '#10a37f', group: 'major' },
  anthropic:  { label: 'Anthropic',  shortLabel: 'Anthropic',  color: '#d97757', group: 'major' },
  google:     { label: 'Google',     shortLabel: 'Google',     color: '#4285f4', group: 'major' },
  meta:       { label: 'Meta',       shortLabel: 'Meta',       color: '#8b5cf6', group: 'major' },

  // Chinese Labs
  deepseek:   { label: 'DeepSeek',   shortLabel: 'DeepSeek',   color: '#4d6bfe', group: 'chinese' },
  alibaba:    { label: 'Alibaba (Qwen)', shortLabel: 'Qwen',   color: '#ff6a00', group: 'chinese' },
  zhipu:      { label: 'Zhipu AI (GLM)', shortLabel: 'Zhipu',  color: '#06b6d4', group: 'chinese' },
  moonshot:   { label: 'Moonshot AI (Kimi)', shortLabel: 'Moonshot', color: '#f43f5e', group: 'chinese' },
  '01ai':     { label: '01.AI (Yi)', shortLabel: '01.AI',      color: '#eab308', group: 'chinese' },
  baidu:      { label: 'Baidu (Ernie)', shortLabel: 'Baidu',   color: '#84cc16', group: 'chinese' },
  minimax:    { label: 'MiniMax',    shortLabel: 'MiniMax',    color: '#ec4899', group: 'chinese' },
  bytedance:  { label: 'ByteDance (Doubao)', shortLabel: 'ByteDance', color: '#f97316', group: 'chinese' },
  meituan:    { label: 'Meituan (LongCat)', shortLabel: 'Meituan', color: '#14b8a6', group: 'chinese' },
  tencent:    { label: 'Tencent (Hunyuan)', shortLabel: 'Tencent', color: '#2563eb', group: 'chinese' },
  xiaomi:     { label: 'Xiaomi (MiMo)', shortLabel: 'Xiaomi', color: '#fb7185', group: 'chinese' },
  kuaishou:   { label: 'Kuaishou (Kling)', shortLabel: 'Kuaishou', color: '#ef4444', group: 'chinese' },
  stepfun:    { label: 'StepFun (Step)', shortLabel: 'StepFun', color: '#d946ef', group: 'chinese' },
  ant:        { label: 'Ant Group (Ling)', shortLabel: 'Ant Group', color: '#3b82f6', group: 'chinese' },

  // Other US Labs
  xai:        { label: 'xAI',        shortLabel: 'xAI',        color: '#22c55e', group: 'other-us' },
  amazon:     { label: 'Amazon',     shortLabel: 'Amazon',     color: '#6366f1', group: 'other-us' },
  microsoft:  { label: 'Microsoft',  shortLabel: 'Microsoft',  color: '#e11d48', group: 'other-us' },
  databricks: { label: 'Databricks', shortLabel: 'Databricks', color: '#0ea5e9', group: 'other-us' },
  reka:       { label: 'Reka AI',    shortLabel: 'Reka',       color: '#a3e635', group: 'other-us' },
  nvidia:     { label: 'NVIDIA (Nemotron)', shortLabel: 'NVIDIA', color: '#76b900', group: 'other-us' },
  cloudflare: { label: 'Cloudflare', shortLabel: 'Cloudflare', color: '#f6821f', group: 'other-us' },
  perplexity: { label: 'Perplexity', shortLabel: 'Perplexity', color: '#20b8cd', group: 'other-us' },

  // Rest-of-World Labs
  mistral:    { label: 'Mistral AI (France)', shortLabel: 'Mistral', color: '#fa500f', group: 'row' },
  cohere:     { label: 'Cohere (Canada)',     shortLabel: 'Cohere',  color: '#ff6f61', group: 'row' },
  ai21:       { label: 'AI21 Labs (Israel)',  shortLabel: 'AI21',    color: '#7c3aed', group: 'row' },
  alephalpha: { label: 'Aleph Alpha (Germany)', shortLabel: 'Aleph Alpha', color: '#64748b', group: 'row' },
  tii:        { label: 'TII / Falcon (UAE)',  shortLabel: 'Falcon',  color: '#059669', group: 'row' },
  bfl:        { label: 'Black Forest Labs (Germany)', shortLabel: 'BFL', color: '#e5e7eb', group: 'row' },

  // Independent decision / classifier models
  typesafe:   { label: 'TypeSafe AI (Jev)', shortLabel: 'TypeSafe', color: '#38bdf8', group: 'decision' },
  kev:        { label: 'Kev (Jared Palmer)', shortLabel: 'Kev', color: '#34d399', group: 'decision' },
  laya:       { label: 'Laya (Convai)', shortLabel: 'Laya', color: '#e879f9', group: 'decision' },
  bespoke:    { label: 'Bespoke Labs (Nimble)', shortLabel: 'Bespoke', color: '#fb923c', group: 'decision' },
  upstage:    { label: 'Upstage (Solar Decide)', shortLabel: 'Upstage', color: '#a3e635', group: 'decision' },
  fastino:    { label: 'Fastino Labs (GLiNER2.5)', shortLabel: 'Fastino', color: '#22d3ee', group: 'decision' },
  xyne:       { label: 'Xyne (XOR)', shortLabel: 'Xyne', color: '#f472b6', group: 'decision' },
  liquid:     { label: 'Liquid AI (d1)', shortLabel: 'Liquid AI', color: '#818cf8', group: 'decision' },
  h2o:        { label: 'H2O.ai (Lightning)', shortLabel: 'H2O.ai', color: '#facc15', group: 'decision' },
  subquadratic:{ label: 'Subquadratic (SubQ Snap)', shortLabel: 'Subquadratic', color: '#2dd4bf', group: 'decision' },
  baseten:    { label: 'Baseten (Base Labs)', shortLabel: 'Baseten', color: '#c084fc', group: 'decision' },
  startlux:   { label: 'StartLux Labs', shortLabel: 'StartLux', color: '#f87171', group: 'decision' },
  vllmsr:     { label: 'vLLM Semantic Router', shortLabel: 'vLLM-SR', color: '#94a3b8', group: 'decision' },
};

export const MODALITY_META = {
  text:       { label: 'Text',       icon: '📝' },
  vision:     { label: 'Vision',     icon: '👁' },
  audio:      { label: 'Audio',      icon: '🔊' },
  reasoning:  { label: 'Reasoning',  icon: '🧠' },
  multimodal: { label: 'Multimodal', icon: '✨' },
};

// Primary function of the release. Models with no `category` field default to
// 'chat' (the original scope) so the ~220 pre-existing entries don't need edits.
export const CATEGORY_META = {
  chat:      { label: 'Chat / Text',   icon: '💬', description: 'Conversational or reasoning LLM' },
  image:     { label: 'Image Gen',     icon: '🖼', description: 'Text-to-image generation or editing' },
  audio:     { label: 'Voice / Audio', icon: '🎙', description: 'Speech synthesis (TTS) or recognition (ASR)' },
  video:     { label: 'Video Gen',     icon: '🎬', description: 'Text-to-video or video editing' },
  document:  { label: 'Document / OCR', icon: '📄', description: 'Document parsing, OCR, structured extraction' },
  decision:  { label: 'Decision / classifier', icon: '⚖', description: 'Non-generative model that returns a decision, label or probability instead of free text' },
  embedding: { label: 'Embedding / Rerank', icon: '🔗', description: 'Embedding or reranking model for search & RAG' },
};
export const DEFAULT_CATEGORY = 'chat';

export const RELEASE_TYPE_META = {
  flagship:      { label: 'Flagship',        description: 'Primary top-tier release' },
  mini:          { label: 'Mini / Efficient', description: 'Smaller, faster, cheaper variant' },
  'open-weight': { label: 'Open-Weight',     description: 'Publicly downloadable weights' },
  preview:       { label: 'Preview',         description: 'Early or limited-access release' },
};

export const RANGE_START = new Date('2022-11-30');
export function getRangeEnd() {
  return new Date();
}

export const DATA_AS_OF = '2026-11-10';
