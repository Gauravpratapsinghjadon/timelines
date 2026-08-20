import { releaseTimelineModel } from './releaseTimelineData.js'
import './releaseTimeline.css'

function LegendItem({ color, label }) {
  return (
    <div className="rt-legendItem">
      <span className="rt-legendSwatch" style={{ background: color }} />
      <span className="rt-legendLabel">{label}</span>
    </div>
  )
}

function MarkerTriangle({ color, label, leftPx }) {
  return (
    <div className="rt-markerTriangle" style={{ left: leftPx }}>
      <div className="rt-markerTriangleInner" style={{ borderBottomColor: color }} />
      <div className="rt-markerTriangleLabel">{label}</div>
    </div>
  )
}

function ReleaseTimeline({ model = releaseTimelineModel }) {
  const colWidth = model.colWidth ?? 96
  const rowHeight = model.rowHeight ?? 64
  const labelWidth = model.labelWidth ?? 340
  const phaseColWidth = model.phaseColWidth ?? 160
  const activityColWidth = model.activityColWidth ?? 220
  const responsibleColWidth = Math.max(0, labelWidth - phaseColWidth - activityColWidth)

  const timelineWidth = model.weeks.length * colWidth
  const boardWidth = labelWidth + timelineWidth

  return (
    <div className="rt-root">
      <div className="rt-titleRow">
        <div className="rt-title">{model.title}</div>
      </div>

      <div className="rt-legend">
        {model.legendItems.map((item) => (
          <LegendItem key={item.label} color={item.color} label={item.label} />
        ))}
      </div>

      <div className="rt-scroll" style={{ width: '100%' }}>
        <div
          className="rt-board"
          style={{
            width: boardWidth,
            ['--rt-col-width']: `${colWidth}px`,
            ['--rt-phase-col-width']: `${phaseColWidth}px`,
            ['--rt-activity-col-width']: `${activityColWidth}px`,
            ['--rt-responsible-col-width']: `${responsibleColWidth}px`,
          }}
        >
          <div className="rt-header">
            <div className="rt-corner" style={{ width: labelWidth }}>
              <div className="rt-labelHeaderGrid">
                <div className="rt-thPhase">Phase</div>
                <div className="rt-thActivities">Activities</div>
                <div className="rt-thResponsible">Responsible</div>
              </div>
            </div>
            <div className="rt-timeHeader" style={{ width: timelineWidth }}>
              <div className="rt-monthRow">
                {model.months.map((m) => {
                  const left = m.startIndex * colWidth
                  const width = (m.endIndex - m.startIndex + 1) * colWidth
                  return (
                    <div
                      key={m.label}
                      className="rt-monthSegment"
                      style={{ left, width }}
                    >
                      {m.label}
                    </div>
                  )
                })}
              </div>

              <div className="rt-weekRow">
                {model.weeks.map((w) => (
                  <div key={w} className="rt-weekCell">
                    {w}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rt-body">
            {model.rows.map((row) => (
              <div
                key={row.id}
                className="rt-row"
                style={{ height: rowHeight }}
              >
                <div className="rt-rowLabel" style={{ width: labelWidth }}>
                  <div className="rt-labelGrid">
                    <div className="rt-phaseCell">
                      <div
                        className="rt-phaseBadge"
                        style={{ background: row.phaseColor }}
                      >
                        {row.phase}
                      </div>
                    </div>
                    <div className="rt-activityCell">{row.text}</div>
                    <div className="rt-responsibleCell">{row.responsible}</div>
                  </div>
                </div>

                <div className="rt-rowTimeline" style={{ width: timelineWidth }}>
                  {typeof model.cutOffIndex === 'number' && (
                    <div
                      className="rt-markerCutoff"
                      style={{ left: model.cutOffIndex * colWidth }}
                    />
                  )}

                  {typeof model.signOffIndex === 'number' && (
                    <MarkerTriangle
                      color={model.colors.signOff}
                      label="Sign Off"
                      leftPx={model.signOffIndex * colWidth + colWidth / 2 - 12}
                    />
                  )}

                  {typeof model.goLiveIndex === 'number' && (
                    <MarkerTriangle
                      color={model.colors.goLive}
                      label="Go-Live"
                      leftPx={model.goLiveIndex * colWidth + colWidth / 2 - 12}
                    />
                  )}

                  {row.bars.map((bar, barIndex) => {
                    const left = bar.startIndex * colWidth
                    const width = (bar.endIndex - bar.startIndex + 1) * colWidth
                    return (
                      <div
                        key={`${row.id}-${barIndex}`}
                        className={[
                          'rt-bar',
                          bar.variant === 'striped' ? 'rt-barStriped' : '',
                        ].join(' ')}
                        style={{
                          left,
                          width,
                          background: bar.color,
                          color: bar.textColor ?? '#ffffff',
                          borderColor: bar.borderColor ?? 'rgba(0,0,0,0.08)',
                        }}
                      >
                        {bar.label}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReleaseTimeline

