import { useState, useMemo, useCallback } from 'react';
import { models } from './data/models.js';
import { GROUP_META, PROVIDER_META, RELEASE_TYPE_META, CATEGORY_META, DEFAULT_CATEGORY, RANGE_START, getRangeEnd } from './data/providers.js';
import FilterPanel from './components/FilterPanel.jsx';
import Timeline from './components/Timeline.jsx';
import DetailPanel from './components/DetailPanel.jsx';

const ALL_GROUPS       = Object.keys(GROUP_META);
const ALL_PROVIDERS    = Object.keys(PROVIDER_META);
const ALL_RELEASETYPES = Object.keys(RELEASE_TYPE_META);
const ALL_CATEGORIES   = Object.keys(CATEGORY_META);
const RANGE_DAYS = Math.round((getRangeEnd() - RANGE_START) / 86400000);

export default function App() {
  const [groups, setGroups]             = useState(new Set(ALL_GROUPS));
  const [providers, setProviders]       = useState(new Set(ALL_PROVIDERS));
  const [releaseTypes, setReleaseTypes] = useState(new Set(ALL_RELEASETYPES));
  const [categories, setCategories]     = useState(new Set(ALL_CATEGORIES));
  const [dateRange, setDateRange]       = useState([0, RANGE_DAYS]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [zoom, setZoom] = useState(2);

  const filteredModels = useMemo(() => {
    const [startDay, endDay] = dateRange;
    return models.filter(m => {
      const providerMeta = PROVIDER_META[m.provider];
      if (!providerMeta) return false;
      if (!groups.has(providerMeta.group)) return false;
      if (!providers.has(m.provider)) return false;
      if (!releaseTypes.has(m.releaseType)) return false;
      if (!categories.has(m.category ?? DEFAULT_CATEGORY)) return false;
      const day = Math.round((new Date(m.releaseDate) - RANGE_START) / 86400000);
      if (day < startDay || day > endDay) return false;
      return true;
    });
  }, [groups, providers, releaseTypes, categories, dateRange]);

  const toggleSet = useCallback((setter, key) => {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setGroups(new Set(ALL_GROUPS));
    setProviders(new Set(ALL_PROVIDERS));
    setReleaseTypes(new Set(ALL_RELEASETYPES));
    setCategories(new Set(ALL_CATEGORIES));
    setDateRange([0, RANGE_DAYS]);
  }, []);

  const handleNavigate = useCallback((id) => {
    const m = models.find(m => m.id === id);
    if (m) setSelectedModel(m);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>LLM Release Timeline</h1>
        <span className="subtitle">Nov 2022 – Today · {filteredModels.length} releases shown</span>
        <div className="spacer" />
        <span className="disclaimer">Data is best-effort and may contain inaccuracies</span>
      </header>

      <div className="app-body">
        <FilterPanel
          groups={groups} onToggleGroup={k => toggleSet(setGroups, k)} onSetGroups={setGroups}
          providers={providers} onToggleProvider={k => toggleSet(setProviders, k)} onSetProviders={setProviders}
          releaseTypes={releaseTypes} onToggleReleaseType={k => toggleSet(setReleaseTypes, k)} onSetReleaseTypes={setReleaseTypes}
          categories={categories} onToggleCategory={k => toggleSet(setCategories, k)} onSetCategories={setCategories}
          dateRange={dateRange} onDateRange={setDateRange}
          rangeDays={RANGE_DAYS}
          onReset={reset}
          modelCount={filteredModels.length}
        />

        <div className="timeline-area">
          <Timeline
            models={filteredModels}
            zoom={zoom}
            setZoom={setZoom}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </div>

        {selectedModel && (
          <DetailPanel
            model={selectedModel}
            allModels={models}
            onClose={() => setSelectedModel(null)}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </div>
  );
}
