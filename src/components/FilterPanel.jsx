import { useState } from 'react';
import { GROUP_META, PROVIDER_META, MODALITY_META, RELEASE_TYPE_META, CATEGORY_META, RANGE_START, DATA_AS_OF } from '../data/providers.js';

const ALL_GROUPS       = Object.keys(GROUP_META).sort((a, b) => GROUP_META[a].order - GROUP_META[b].order);
const ALL_PROVIDERS    = Object.keys(PROVIDER_META);
const ALL_MODALITIES   = Object.keys(MODALITY_META);
const ALL_RELEASETYPES = Object.keys(RELEASE_TYPE_META);
const ALL_CATEGORIES   = Object.keys(CATEGORY_META);

function dayToDate(day) {
  const d = new Date(RANGE_START.getTime() + day * 86400000);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function SelectAllNone({ allKeys, activeSet, onSetAll, onSetNone }) {
  const allOn  = allKeys.every(k => activeSet.has(k));
  const allOff = allKeys.every(k => !activeSet.has(k));
  return (
    <div className="select-all-none">
      <button
        className={`san-btn${allOn ? ' san-active' : ''}`}
        onClick={() => onSetAll(new Set(allKeys))}
      >all</button>
      <span className="san-sep">·</span>
      <button
        className={`san-btn${allOff ? ' san-active' : ''}`}
        onClick={() => onSetNone(new Set())}
      >none</button>
    </div>
  );
}

export default function FilterPanel({
  groups,       onToggleGroup,       onSetGroups,
  providers,    onToggleProvider,    onSetProviders,
  modalities,   onToggleModality,    onSetModalities,
  releaseTypes, onToggleReleaseType, onSetReleaseTypes,
  categories,   onToggleCategory,    onSetCategories,
  dateRange, onDateRange,
  rangeDays,
  onReset,
  modelCount,
}) {
  const [collapsed, setCollapsed] = useState(false);

  const handleStart = (e) => {
    const v = parseInt(e.target.value);
    onDateRange([Math.min(v, dateRange[1] - 14), dateRange[1]]);
  };

  const handleEnd = (e) => {
    const v = parseInt(e.target.value);
    onDateRange([dateRange[0], Math.max(v, dateRange[0] + 14)]);
  };

  const fillLeft  = `${(dateRange[0] / rangeDays) * 100}%`;
  const fillRight = `${(1 - dateRange[1] / rangeDays) * 100}%`;

  if (collapsed) {
    return (
      <div className="filter-panel collapsed" onClick={() => setCollapsed(false)} style={{ cursor: 'pointer' }}>
        <div className="filter-panel-toggle" style={{ justifyContent: 'center', padding: '10px 0' }}>
          <span style={{ fontSize: 14 }}>›</span>
        </div>
      </div>
    );
  }

  return (
    <div className="filter-panel">
      <div className="filter-panel-toggle" onClick={() => setCollapsed(true)}>
        <span>Filters</span>
        <span style={{ fontSize: 12 }}>‹</span>
      </div>

      {/* Group */}
      <div className="filter-section">
        <div className="filter-section-header">
          <div className="filter-section-title">Group</div>
          <SelectAllNone allKeys={ALL_GROUPS} activeSet={groups} onSetAll={onSetGroups} onSetNone={onSetGroups} />
        </div>
        {ALL_GROUPS.map(key => (
          <div
            key={key}
            className={`filter-toggle-row ${groups.has(key) ? 'active' : ''}`}
            onClick={() => onToggleGroup(key)}
          >
            <span className="group-dot" style={{ background: GROUP_META[key].color }} />
            <span className="toggle-label">{GROUP_META[key].label}</span>
            <span className="toggle-check">✓</span>
          </div>
        ))}
      </div>

      {/* Provider */}
      <div className="filter-section">
        <div className="filter-section-header">
          <div className="filter-section-title">Provider</div>
          <SelectAllNone allKeys={ALL_PROVIDERS} activeSet={providers} onSetAll={onSetProviders} onSetNone={onSetProviders} />
        </div>
        {ALL_GROUPS.map(groupKey => (
          <div key={groupKey}>
            <div className="provider-group-divider">{GROUP_META[groupKey].label}</div>
            {ALL_PROVIDERS.filter(p => PROVIDER_META[p].group === groupKey).map(key => (
              <div
                key={key}
                className={`filter-toggle-row ${providers.has(key) ? 'active' : ''}`}
                onClick={() => onToggleProvider(key)}
              >
                <span className="provider-dot" style={{ background: PROVIDER_META[key].color }} />
                <span className="toggle-label">{PROVIDER_META[key].label}</span>
                <span className="toggle-check">✓</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Model Type */}
      <div className="filter-section">
        <div className="filter-section-header">
          <div className="filter-section-title">Model Type</div>
          <SelectAllNone allKeys={ALL_CATEGORIES} activeSet={categories} onSetAll={onSetCategories} onSetNone={onSetCategories} />
        </div>
        {ALL_CATEGORIES.map(key => (
          <div
            key={key}
            className={`filter-toggle-row ${categories.has(key) ? 'active' : ''}`}
            onClick={() => onToggleCategory(key)}
          >
            <span style={{ fontSize: 12, width: 16, textAlign: 'center', flexShrink: 0 }}>{CATEGORY_META[key].icon}</span>
            <span className="toggle-label">{CATEGORY_META[key].label}</span>
            <span className="toggle-check">✓</span>
          </div>
        ))}
      </div>

      {/* Modality */}
      <div className="filter-section">
        <div className="filter-section-header">
          <div className="filter-section-title">Modality</div>
          <SelectAllNone allKeys={ALL_MODALITIES} activeSet={modalities} onSetAll={onSetModalities} onSetNone={onSetModalities} />
        </div>
        {ALL_MODALITIES.map(key => (
          <div
            key={key}
            className={`filter-toggle-row ${modalities.has(key) ? 'active' : ''}`}
            onClick={() => onToggleModality(key)}
          >
            <span style={{ fontSize: 12, width: 16, textAlign: 'center', flexShrink: 0 }}>{MODALITY_META[key].icon}</span>
            <span className="toggle-label">{MODALITY_META[key].label}</span>
            <span className="toggle-check">✓</span>
          </div>
        ))}
      </div>

      {/* Release Type */}
      <div className="filter-section">
        <div className="filter-section-header">
          <div className="filter-section-title">Release Type</div>
          <SelectAllNone allKeys={ALL_RELEASETYPES} activeSet={releaseTypes} onSetAll={onSetReleaseTypes} onSetNone={onSetReleaseTypes} />
        </div>
        <div className="reltype-buttons">
          {ALL_RELEASETYPES.map(key => (
            <button
              key={key}
              className={`reltype-btn ${releaseTypes.has(key) ? 'active' : ''}`}
              onClick={() => onToggleReleaseType(key)}
            >
              {RELEASE_TYPE_META[key].label}
              <span className="reltype-desc">{RELEASE_TYPE_META[key].description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date range */}
      <div className="filter-section">
        <div className="filter-section-title">Date Range</div>
        <div className="date-range-labels">
          <span>{dayToDate(dateRange[0])}</span>
          <span>{dayToDate(dateRange[1])}</span>
        </div>
        <div className="dual-slider">
          <div className="slider-track-bg">
            <div className="slider-track-fill" style={{ left: fillLeft, right: fillRight }} />
          </div>
          <input type="range" min={0} max={rangeDays} value={dateRange[0]} onChange={handleStart} style={{ zIndex: dateRange[0] > rangeDays - 100 ? 5 : 3 }} />
          <input type="range" min={0} max={rangeDays} value={dateRange[1]} onChange={handleEnd} style={{ zIndex: 4 }} />
        </div>
        <button className="reset-btn" onClick={onReset}>Reset All Filters</button>
      </div>

      <div className="model-count">{modelCount} release{modelCount !== 1 ? 's' : ''} visible</div>
      <div className="data-as-of">Data as of {DATA_AS_OF} — best-effort, may contain inaccuracies</div>
    </div>
  );
}
