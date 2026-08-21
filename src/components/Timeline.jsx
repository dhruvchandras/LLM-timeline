import { useRef, useState, useCallback, useEffect } from 'react';
import { GROUP_META, PROVIDER_META, MODALITY_META, CATEGORY_META, DEFAULT_CATEGORY, RANGE_START, getRangeEnd } from '../data/providers.js';
import ModelDot from './ModelDot.jsx';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const CHAR_PX = 6;
const LABEL_GAP = 8;

function labelWidth(name) {
  const truncated = name.length > 32 ? name.slice(0, 30) + '…' : name;
  return Math.min(130, truncated.length * CHAR_PX);
}

// Greedy row-assignment: sorts models by x position, then assigns each to
// the first row whose rightmost placed label doesn't overlap this one.
function assignLabelRows(laneModels, getX) {
  const sorted = [...laneModels].sort((a, b) => getX(a) - getX(b));
  const rowRightEdge = {};
  const result = {};

  for (const m of sorted) {
    const cx = getX(m);
    const hw = labelWidth(m.name) / 2;
    const left = cx - hw;

    let row = 0;
    while ((rowRightEdge[row] ?? -Infinity) > left - LABEL_GAP) {
      row++;
    }
    rowRightEdge[row] = cx + hw;
    result[m.id] = row;
  }

  return result;
}

const SAME_DATE_SPACING = 9; // px between dot centres when multiple releases share a date

// Multiple same-provider releases on the same date land on the exact same x,
// producing fully-overlapping concentric dots (the largest one swallows clicks
// on the smaller ones underneath) — spread same-x dots out horizontally so
// every dot stays independently visible and clickable.
function computeDotX(laneModels, dateX) {
  const baseX = {};
  laneModels.forEach(m => { baseX[m.id] = dateX(m.releaseDate); });

  const groups = {};
  laneModels.forEach(m => {
    const key = Math.round(baseX[m.id]);
    (groups[key] ??= []).push(m);
  });

  const finalX = {};
  Object.values(groups).forEach(group => {
    if (group.length === 1) {
      finalX[group[0].id] = baseX[group[0].id];
      return;
    }
    group
      .slice()
      .sort((a, b) => b.notability - a.notability)
      .forEach((m, i) => {
        finalX[m.id] = baseX[m.id] + (i - (group.length - 1) / 2) * SAME_DATE_SPACING;
      });
  });

  return finalX;
}

function dateToDay(dateStr, rangeStart) {
  return Math.round((new Date(dateStr) - rangeStart) / 86400000);
}

const DOT_TOP = 10;
const ROW_HEIGHT = 16;
// Must match ModelDot.jsx's LABEL_TOP_BASE — dots are positioned by top-left,
// so this needs to clear the full max dot height (19px), not just its radius.
const DOT_MAX_HEIGHT = 19;
const LABEL_TOP_BASE = DOT_TOP + DOT_MAX_HEIGHT + 6;
const LANE_HEADER_WIDTH = 150;

export default function Timeline({
  models, zoom, setZoom, selectedModel, onSelectModel,
}) {
  const scrollRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [collapsedLanes, setCollapsedLanes] = useState({});
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [panMode, setPanMode] = useState(true);
  const panOrigin  = useRef(null);
  const isDragging = useRef(false);

  const rangeStart = RANGE_START;
  const rangeEnd = getRangeEnd();
  const rangeDays = Math.round((rangeEnd - rangeStart) / 86400000);

  const handlePointerDown = useCallback((e) => {
    if (!panMode || e.button !== 0) return;
    panOrigin.current  = { x: e.clientX, scrollLeft: scrollRef.current.scrollLeft };
    isDragging.current = false;
  }, [panMode]);

  const handlePointerMove = useCallback((e) => {
    if (!panMode || !panOrigin.current) return;
    const dx = e.clientX - panOrigin.current.x;
    if (!isDragging.current && Math.abs(dx) > 5) {
      isDragging.current = true;
      scrollRef.current.setPointerCapture(e.pointerId);
    }
    if (isDragging.current) {
      scrollRef.current.scrollLeft = panOrigin.current.scrollLeft - dx;
    }
  }, [panMode]);

  const handlePointerUp = useCallback(() => {
    panOrigin.current  = null;
    isDragging.current = false;
  }, []);

  const pxPerDay = zoom * 3;
  const totalWidth = rangeDays * pxPerDay + 260;

  const dayToX = useCallback((day) => 130 + day * pxPerDay, [pxPerDay]);
  const dateX  = useCallback((dateStr) => dayToX(dateToDay(dateStr, rangeStart)), [dayToX, rangeStart]);

  useEffect(() => {
    if (selectedModel && scrollRef.current) {
      const x = dateX(selectedModel.releaseDate);
      const containerW = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = Math.max(0, x - containerW / 2);
    }
  }, [selectedModel, dateX]);

  // Group providers into their 4 buckets, then providers into per-provider model lists
  const groupKeys = Object.keys(GROUP_META).sort((a, b) => GROUP_META[a].order - GROUP_META[b].order);
  const providersByGroup = {};
  groupKeys.forEach(g => { providersByGroup[g] = []; });
  Object.keys(PROVIDER_META).forEach(p => {
    const g = PROVIDER_META[p].group;
    if (providersByGroup[g]) providersByGroup[g].push(p);
  });

  const byProvider = {};
  Object.keys(PROVIDER_META).forEach(p => { byProvider[p] = []; });
  models.forEach(m => { if (byProvider[m.provider]) byProvider[m.provider].push(m); });

  const laneData = {};
  Object.keys(PROVIDER_META).forEach(providerKey => {
    const laneModels = byProvider[providerKey];
    const xById      = computeDotX(laneModels, dateX);
    const rowAssign  = assignLabelRows(laneModels, m => xById[m.id]);
    const maxRow     = laneModels.length ? Math.max(...laneModels.map(m => rowAssign[m.id])) : 0;
    const laneHeight = LABEL_TOP_BASE + (maxRow + 1) * ROW_HEIGHT + 6;
    laneData[providerKey] = { xById, rowAssign, laneHeight };
  });

  const toggleLane  = (p) => setCollapsedLanes(prev => ({ ...prev, [p]: !prev[p] }));
  const toggleGroup = (g) => setCollapsedGroups(prev => ({ ...prev, [g]: !prev[g] }));

  const yearTicks  = [];
  const monthTicks = [];
  const startYear = rangeStart.getFullYear();
  const endYear = rangeEnd.getFullYear();
  for (let y = startYear; y <= endYear; y++) {
    const d = new Date(y, 0, 1);
    if (d < rangeStart) continue;
    const day = Math.round((d - rangeStart) / 86400000);
    yearTicks.push({ day, year: y });
    for (let m = 0; m < 12; m++) {
      const md   = new Date(y, m, 1);
      const mday = Math.round((md - rangeStart) / 86400000);
      if (mday < 0 || mday > rangeDays) continue;
      monthTicks.push({ day: mday, label: MONTHS[m], isJan: m === 0 });
    }
  }

  return (
    <>
      <div className="timeline-controls">
        <span className="zoom-label">Zoom</span>
        <button className="zoom-btn" onClick={() => setZoom(z => Math.max(1, z - 1))} disabled={zoom <= 1}>−</button>
        <span className="zoom-level">{zoom}×</span>
        <button className="zoom-btn" onClick={() => setZoom(z => Math.min(8, z + 1))} disabled={zoom >= 8}>+</button>

        <div className="controls-sep" />

        <button
          className={`zoom-btn pan-btn${panMode ? ' active' : ''}`}
          onClick={() => setPanMode(m => !m)}
          title={panMode ? 'Pan mode ON — click to switch back to select' : 'Pan mode — drag to scroll'}
        >
          {panMode ? '✋' : '🖐'}
        </button>
      </div>

      <div
        className={`timeline-scroll${panMode ? ' pan-active' : ''}`}
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="timeline-canvas" style={{ width: totalWidth }}>

          <div className="timeline-axis" style={{ width: totalWidth }}>
            <div className="axis-years">
              {yearTicks.map(({ day, year }) => (
                <div key={year}>
                  <div className="axis-year-tick"  style={{ left: dayToX(day) }} />
                  <div className="axis-year-label" style={{ left: dayToX(day) }}>{year}</div>
                </div>
              ))}
            </div>
            <div className="axis-months">
              {monthTicks.filter(t => !t.isJan).map(({ day, label }) => (
                <div key={`${label}-${day}`}>
                  <div className="axis-month-tick" style={{ left: dayToX(day) }} />
                  {pxPerDay > 1.5 && (
                    <div className="axis-month-label" style={{ left: dayToX(day) }}>{label}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lanes-container">
            {groupKeys.map(groupKey => {
              const groupMeta = GROUP_META[groupKey];
              const providers = providersByGroup[groupKey];
              const groupCollapsed = collapsedGroups[groupKey];
              const visibleProviders = providers.filter(p => byProvider[p].length > 0 || true);

              return (
                <div key={groupKey} className="group-section">
                  <div className="group-header" style={{ width: totalWidth }} onClick={() => toggleGroup(groupKey)}>
                    <div className="group-color-banner" style={{ background: groupMeta.color }} />
                    <span className="group-name">{groupMeta.label}</span>
                    <span className="group-collapse-icon">{groupCollapsed ? '▸' : '▾'}</span>
                  </div>

                  <div className={`group-body ${groupCollapsed ? 'collapsed' : ''}`}>
                    {visibleProviders.map(providerKey => {
                      const meta = PROVIDER_META[providerKey];
                      const laneModels = byProvider[providerKey];
                      const isCollapsed = collapsedLanes[providerKey];
                      const { xById, rowAssign, laneHeight } = laneData[providerKey];

                      return (
                        <div key={providerKey} className="provider-lane">
                          <div className="lane-header" onClick={(e) => { e.stopPropagation(); toggleLane(providerKey); }}>
                            <div className="lane-color-bar" style={{ background: meta.color }} />
                            <span className="lane-name">{meta.shortLabel}</span>
                            <span className="lane-collapse-icon">{isCollapsed ? '▸' : '▾'}</span>
                          </div>

                          <div
                            className={`lane-body ${isCollapsed ? 'collapsed' : ''}`}
                            style={isCollapsed ? undefined : { height: laneHeight }}
                          >
                            {yearTicks.map(({ day, year }) => (
                              <div key={year} className="grid-line year" style={{ left: dayToX(day) - LANE_HEADER_WIDTH }} />
                            ))}

                            {laneModels.length === 0 && !isCollapsed && (
                              <div style={{
                                position: 'absolute', inset: 0, display: 'flex',
                                alignItems: 'center', paddingLeft: 16,
                                fontSize: 10, color: 'var(--text-faint)', fontStyle: 'italic',
                              }}>
                                No releases match filters
                              </div>
                            )}

                            {laneModels.map(m => (
                              <ModelDot
                                key={m.id}
                                model={m}
                                x={xById[m.id] - LANE_HEADER_WIDTH}
                                labelRow={rowAssign[m.id] ?? 0}
                                isSelected={selectedModel?.id === m.id}
                                onClick={() => onSelectModel(m)}
                                onMouseEnter={(e) => setTooltip({ model: m, x: e.clientX, y: e.clientY })}
                                onMouseMove={(e)  => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : t)}
                                onMouseLeave={()  => setTooltip(null)}
                                providerColor={meta.color}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {models.length === 0 && (
            <div className="no-models-msg">
              <span>No releases match your filters</span>
              <small>Try adjusting the filters or date range</small>
            </div>
          )}
        </div>
      </div>

      {tooltip && <Tooltip model={tooltip.model} x={tooltip.x} y={tooltip.y} />}
    </>
  );
}

function Tooltip({ model, x, y }) {
  const meta = PROVIDER_META[model.provider];
  const groupMeta = GROUP_META[meta.group];
  const date = new Date(model.releaseDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  const tipW = 260, tipH = 120;
  const left = x + 14 + tipW > window.innerWidth  ? x - tipW - 14 : x + 14;
  const top  = y + 14 + tipH > window.innerHeight ? y - tipH - 14 : y + 14;

  return (
    <div className="model-tooltip" style={{ left, top }}>
      <div className="tooltip-date">{date}</div>
      <div className="tooltip-title">{model.name}</div>
      <div className="tooltip-meta">
        <span className="tooltip-tag" style={{ color: meta.color, borderColor: meta.color + '44' }}>{meta.shortLabel}</span>
        <span className="tooltip-tag">{groupMeta.label}</span>
        <span className="tooltip-tag">{CATEGORY_META[model.category ?? DEFAULT_CATEGORY]?.icon} {CATEGORY_META[model.category ?? DEFAULT_CATEGORY]?.label}</span>
        {model.modalities?.map(mod => (
          <span key={mod} className="tooltip-tag">{MODALITY_META[mod]?.icon} {MODALITY_META[mod]?.label}</span>
        ))}
      </div>
      <div className="tooltip-sig">
        {[1,2,3,4,5].map(n => (
          <span key={n} className={`sig-star ${n <= model.notability ? 'filled' : ''}`}>★</span>
        ))}
      </div>
    </div>
  );
}
