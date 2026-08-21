import { PROVIDER_META, GROUP_META, MODALITY_META, RELEASE_TYPE_META, CATEGORY_META, DEFAULT_CATEGORY } from '../data/providers.js';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatContextWindow(n) {
  if (!n) return 'Not publicly disclosed';
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M tokens`;
  if (n >= 1000) return `${Math.round(n / 1000)}K tokens`;
  return `${n} tokens`;
}

function formatPrice(model) {
  if (model.pricingNote) return model.pricingNote;
  if (model.pricing) return `$${model.pricing.input.toFixed(2)} in / $${model.pricing.output.toFixed(2)} out per 1M tokens`;
  return 'Not publicly priced';
}

function Stars({ n }) {
  return (
    <div className="sig-row">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`sig-star ${i <= n ? 'filled' : ''}`}>★</span>
      ))}
    </div>
  );
}

export default function DetailPanel({ model, allModels, onClose, onNavigate }) {
  const provider = PROVIDER_META[model.provider];
  const group = GROUP_META[provider?.group];
  const releaseType = RELEASE_TYPE_META[model.releaseType];
  const category = CATEGORY_META[model.category ?? DEFAULT_CATEGORY];
  const isChat = (model.category ?? DEFAULT_CATEGORY) === 'chat';

  const relatedModels = (model.relatedModelIds || [])
    .map(id => allModels.find(m => m.id === id))
    .filter(Boolean);

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div className="detail-provider-bar" style={{ background: provider?.color }} />
        <div className="detail-header-top">
          <div style={{ flex: 1 }}>
            <div className="detail-date">{formatDate(model.releaseDate)}</div>
            <h2 className="detail-title">{model.name}</h2>
            {model.version && model.version !== model.name && (
              <div className="detail-version">{model.version}</div>
            )}
          </div>
          <button className="detail-close" onClick={onClose}>✕</button>
        </div>
        <div className="detail-tags">
          <span className="detail-tag" style={{ color: provider?.color, borderColor: (provider?.color ?? '#888') + '55' }}>
            {provider?.label}
          </span>
          <span className="detail-tag">{group?.label}</span>
          <span className="detail-tag">{category?.icon} {category?.label}</span>
          {model.modalities?.map(mod => (
            <span key={mod} className="detail-tag">{MODALITY_META[mod]?.icon} {MODALITY_META[mod]?.label}</span>
          ))}
          <span className="detail-tag reltype">{releaseType?.label}</span>
        </div>
      </div>

      <div className="detail-body">
        <div>
          <div className="detail-section-label">Notability</div>
          <Stars n={model.notability} />
        </div>

        <div>
          <div className="detail-section-label">Overview</div>
          <p className="detail-description">{model.blurb}</p>
        </div>

        <div>
          <div className="detail-section-label">Specs</div>
          <div className="detail-specs">
            {(isChat || model.contextWindow) && (
              <div className="spec-row">
                <span className="spec-label">Context window</span>
                <span className="spec-value">{formatContextWindow(model.contextWindow)}</span>
              </div>
            )}
            <div className="spec-row">
              <span className="spec-label">Pricing</span>
              <span className="spec-value">{formatPrice(model)}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="detail-section-label">Benchmarks</div>
          {model.benchmarks?.length > 0 ? (
            <>
              <table className="benchmark-table">
                <tbody>
                  {model.benchmarks.map(b => (
                    <tr key={b.name}>
                      <td>{b.name}</td>
                      <td>{b.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="benchmark-caption">Self-reported by the provider; methodology varies across labs and scores are not directly comparable.</div>
            </>
          ) : (
            <div className="no-benchmarks">No public benchmark scores found for this release.</div>
          )}
        </div>

        {relatedModels.length > 0 && (
          <div>
            <div className="detail-section-label">Related Models</div>
            <div className="related-list">
              {relatedModels.map(rel => {
                const relProvider = PROVIDER_META[rel.provider];
                return (
                  <button key={rel.id} className="related-item" onClick={() => onNavigate(rel.id)}>
                    <div className="related-dot" style={{ background: relProvider?.color }} />
                    <div className="related-text">
                      <div className="related-title">{rel.name}</div>
                      <div className="related-date">
                        {new Date(rel.releaseDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' · '}{relProvider?.shortLabel}
                      </div>
                    </div>
                    <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>›</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {model.sourceUrls?.length > 0 && (
          <div>
            <div className="detail-section-label">Sources</div>
            <div className="sources-list">
              {model.sourceUrls.map(url => (
                <a key={url} className="source-link" href={url} target="_blank" rel="noopener noreferrer">{url}</a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
