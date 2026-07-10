import { MODALITY_META } from '../data/providers.js';

const NOTABILITY_SIZES = [8, 10, 12, 15, 19];
const DOT_TOP = 10;
const ROW_HEIGHT = 16;
// Dots are positioned by top-left (see `top: DOT_TOP` below), not centre, so
// the label must clear the full dot height (largest = 19px), not just its radius.
const DOT_MAX_HEIGHT = 19;
const LABEL_TOP_BASE = DOT_TOP + DOT_MAX_HEIGHT + 6;

function shortName(name) {
  return name.length > 32 ? name.slice(0, 30).trimEnd() + '…' : name;
}

export default function ModelDot({ model, x, labelRow, isSelected, onClick, onMouseEnter, onMouseMove, onMouseLeave, providerColor }) {
  const size = NOTABILITY_SIZES[model.notability - 1] ?? 12;
  const icon = MODALITY_META[model.modalities?.[0]]?.icon ?? '';
  const fill = providerColor + 'bb';
  const border = providerColor;
  const labelTop = LABEL_TOP_BASE + labelRow * ROW_HEIGHT;

  return (
    <div
      className={`model-pin${isSelected ? ' selected' : ''}`}
      style={{ left: x }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="model-dot"
        style={{
          position: 'absolute',
          top: DOT_TOP,
          left: -(size / 2),
          width: size,
          height: size,
          background: fill,
          borderColor: border,
        }}
      >
        {size >= 14 && <span className="dot-icon">{icon}</span>}
      </div>

      {labelRow > 0 && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: DOT_TOP + size / 2,
          width: 1,
          height: labelTop - (DOT_TOP + size / 2),
          background: providerColor,
          opacity: 0.3,
        }} />
      )}

      <div
        className="model-label"
        style={{ position: 'absolute', top: labelTop, color: providerColor }}
      >
        {shortName(model.name)}
      </div>
    </div>
  );
}
