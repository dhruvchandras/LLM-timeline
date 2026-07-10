export const GROUPS = {
  MAJOR: 'major',
  CHINESE: 'chinese',
  OTHER_US: 'other-us',
  ROW: 'row',
};

export const GROUP_META = {
  major:      { label: 'Major Labs',          color: '#4fd1c5', order: 0 },
  chinese:    { label: 'Chinese Labs',         color: '#f43f5e', order: 1 },
  'other-us': { label: 'Other US Labs',        color: '#a78bfa', order: 2 },
  row:        { label: 'Rest-of-World Labs',   color: '#fbbf24', order: 3 },
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

  // Other US Labs
  xai:        { label: 'xAI',        shortLabel: 'xAI',        color: '#22c55e', group: 'other-us' },
  amazon:     { label: 'Amazon',     shortLabel: 'Amazon',     color: '#6366f1', group: 'other-us' },
  microsoft:  { label: 'Microsoft',  shortLabel: 'Microsoft',  color: '#e11d48', group: 'other-us' },
  databricks: { label: 'Databricks', shortLabel: 'Databricks', color: '#0ea5e9', group: 'other-us' },
  reka:       { label: 'Reka AI',    shortLabel: 'Reka',       color: '#a3e635', group: 'other-us' },

  // Rest-of-World Labs
  mistral:    { label: 'Mistral AI (France)', shortLabel: 'Mistral', color: '#fa500f', group: 'row' },
  cohere:     { label: 'Cohere (Canada)',     shortLabel: 'Cohere',  color: '#ff6f61', group: 'row' },
  ai21:       { label: 'AI21 Labs (Israel)',  shortLabel: 'AI21',    color: '#7c3aed', group: 'row' },
  alephalpha: { label: 'Aleph Alpha (Germany)', shortLabel: 'Aleph Alpha', color: '#64748b', group: 'row' },
  tii:        { label: 'TII / Falcon (UAE)',  shortLabel: 'Falcon',  color: '#059669', group: 'row' },
};

export const MODALITY_META = {
  text:       { label: 'Text',       icon: '📝' },
  vision:     { label: 'Vision',     icon: '👁' },
  audio:      { label: 'Audio',      icon: '🔊' },
  reasoning:  { label: 'Reasoning',  icon: '🧠' },
  multimodal: { label: 'Multimodal', icon: '✨' },
};

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

export const DATA_AS_OF = '2026-07-09';
