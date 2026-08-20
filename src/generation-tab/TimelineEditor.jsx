import { useState } from 'react'
import { isoWeeks, MS_KINDS } from './timelineUtils.js'

function TimelineEditor({ generation, onSave, onClose }) {
  const tl = generation.timeline
  const weekCount = Math.max(isoWeeks(tl.startWeek, tl.endWeek).length, 1)

  const [rows, setRows] = useState(() =>
    (tl.rows || []).map((r) => ({
      ...r,
      ms: (r.ms || []).map((m) => ({ ...m })),
    })),
  )

  const updateRow = (index, patch) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  const updateMs = (rowIndex, msIndex, patch) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== rowIndex) return r
        const ms = r.ms.map((m, j) => (j === msIndex ? { ...m, ...patch } : m))
        return { ...r, ms }
      }),
    )
  }

  const addMs = (rowIndex) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== rowIndex) return r
        return {
          ...r,
          ms: [...(r.ms || []), { kind: 'comms', at: Math.max(0, r.to || 0), label: '' }],
        }
      }),
    )
  }

  const removeMs = (rowIndex, msIndex) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== rowIndex) return r
        return { ...r, ms: r.ms.filter((_, j) => j !== msIndex) }
      }),
    )
  }

  const handleSave = () => {
    const normalized = rows.map((r) => {
      let a = +r.from
      let b = +r.to
      if (a > b) [a, b] = [b, a]
      return {
        ...r,
        from: a,
        to: b,
        hatchTo: r.hatchTo === '' || r.hatchTo == null ? null : +r.hatchTo,
        ms: (r.ms || []).map((m) => ({ ...m, at: +m.at })),
      }
    })
    onSave(normalized)
  }

  return (
    <div className="gt-modal-back" onClick={onClose}>
      <div className="gt-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="gt-ct">
          Edit timeline — {generation.code}{' '}
          <span className="gt-cs">
            {weekCount} weeks ({tl.startWeek} → {tl.endWeek})
          </span>
          <button type="button" className="gt-btn gt-btn-sm" onClick={onClose}>
            Close
          </button>
        </div>

        <p className="gt-muted" style={{ fontSize: 13, margin: '0 0 12px' }}>
          Set each activity&apos;s bar (start / end week) and drop icons onto a week. Changes apply
          to the image when you save.
        </p>

        <div style={{ maxHeight: '58vh', overflow: 'auto', paddingRight: 4 }}>
          {rows.map((r, i) => (
            <div key={i} className="gt-tl-row-edit">
              <div className="gt-smallcap">{r.phase}</div>

              <div className="gt-fr" style={{ marginTop: 6 }}>
                <div className="gt-fg">
                  <label>Activity</label>
                  <input
                    type="text"
                    value={r.activity}
                    onChange={(e) => updateRow(i, { activity: e.target.value })}
                  />
                </div>
                <div className="gt-fg">
                  <label>Responsible</label>
                  <input
                    type="text"
                    value={r.responsible}
                    onChange={(e) => updateRow(i, { responsible: e.target.value })}
                  />
                </div>
              </div>

              <div className="gt-fr3">
                <div className="gt-fg">
                  <label>Bar from</label>
                  <select value={r.from} onChange={(e) => updateRow(i, { from: +e.target.value })}>
                    {Array.from({ length: weekCount }, (_, w) => (
                      <option key={w} value={w}>
                        W{w + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="gt-fg">
                  <label>Bar to</label>
                  <select value={r.to} onChange={(e) => updateRow(i, { to: +e.target.value })}>
                    {Array.from({ length: weekCount }, (_, w) => (
                      <option key={w} value={w}>
                        W{w + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="gt-fg">
                  <label>Bar style</label>
                  <select value={r.kind} onChange={(e) => updateRow(i, { kind: e.target.value })}>
                    <option value="teal">Continuous (teal)</option>
                    <option value="magenta">Active (magenta)</option>
                    <option value="hatch-magenta">Prep then active (hatched → magenta)</option>
                    <option value="marker">Icons only (no bar)</option>
                  </select>
                </div>
              </div>

              {r.kind === 'hatch-magenta' && (
                <div className="gt-fg">
                  <label>Hatch until week</label>
                  <select
                    style={{ maxWidth: 160 }}
                    value={r.hatchTo ?? r.from}
                    onChange={(e) => updateRow(i, { hatchTo: +e.target.value })}
                  >
                    {Array.from({ length: weekCount }, (_, w) => (
                      <option key={w} value={w}>
                        W{w + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="gt-smallcap gt-mt">Icons on this row</div>
              {(r.ms || []).length ? (
                r.ms.map((m, j) => (
                  <div key={j} className="gt-tl-ms">
                    <select value={m.kind} onChange={(e) => updateMs(i, j, { kind: e.target.value })}>
                      {MS_KINDS.map(([k, l]) => (
                        <option key={k} value={k}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <select value={m.at} onChange={(e) => updateMs(i, j, { at: +e.target.value })}>
                      {Array.from({ length: weekCount }, (_, w) => (
                        <option key={w} value={w}>
                          W{w + 1}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={m.label || ''}
                      placeholder="Label (optional)"
                      onChange={(e) => updateMs(i, j, { label: e.target.value })}
                    />
                    <button
                      type="button"
                      className="gt-btn gt-btn-sm gt-btn-d"
                      onClick={() => removeMs(i, j)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <div className="gt-fh">No icons on this row yet.</div>
              )}

              <div className="gt-br gt-mt">
                <button type="button" className="gt-btn gt-btn-sm" onClick={() => addMs(i)}>
                  ＋ Add icon
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="gt-br gt-mt">
          <button type="button" className="gt-btn gt-btn-p" onClick={handleSave}>
            Save &amp; update image
          </button>
          <button type="button" className="gt-btn" onClick={onClose}>
            Cancel
          </button>
          <span className="gt-fh">
            Progress = teal pin · Communication / Cut-off / Sign-off / Go-live = triangles.
          </span>
        </div>
      </div>
    </div>
  )
}

export default TimelineEditor
