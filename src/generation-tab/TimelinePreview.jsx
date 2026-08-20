import { downloadSvg } from './timelineUtils.js'

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  )
}

function TimelinePreview({ generations, selected, onSelect, onEdit, isEditable = true }) {
  if (!selected?.timeline?.svg1) {
    return <div className="gt-empty">No timeline yet — create a generation to generate the image.</div>
  }

  const withTimeline = generations.filter((g) => g.timeline?.svg1)

  return (
    <>
      <div className="gt-tl-actions">
        <div className="gt-br">
          <label className="gt-fh" style={{ margin: 0 }}>
            Showing
          </label>
          <select
            style={{ width: 'auto' }}
            value={selected.id}
            onChange={(e) => onSelect(+e.target.value)}
          >
            {withTimeline.map((g) => (
              <option key={g.id} value={g.id}>
                {g.code}
              </option>
            ))}
          </select>
        </div>
        <div className="gt-br">
          {isEditable && (
            <button type="button" className="gt-gear" onClick={onEdit} title="Edit bars and milestone icons">
              <GearIcon /> Edit timeline
            </button>
          )}
          <button
            type="button"
            className="gt-btn gt-btn-sm"
            onClick={() => downloadSvg(selected.timeline.svg1, `${selected.code}-timeline`)}
          >
            Download PNG / SVG
          </button>
        </div>
      </div>

      <div
        className="gt-timeline-wrap gt-mb"
        dangerouslySetInnerHTML={{ __html: selected.timeline.svg1 }}
      />

      <div className="gt-fh">
        Scroll the chart when there are many rows. Use <strong>Edit timeline</strong> to move bars
        and icons by week.
      </div>
    </>
  )
}

export default TimelinePreview
