export const PHASE_COL = {
  '0. Continuous': '#4A9BC7',
  'I. Planning & Prep': '#2F6FB6',
  'II. Validation and design': '#173A6A',
  'GCH Cycle': '#E6B800',
  'III. Approvals and sign-offs': '#173A6A',
  'IV. Go Live': '#173A6A',
  'V. Post go-live': '#1A4A7A',
}

export const MS_KINDS = [
  ['progress', 'Progress update', '#5EC8C0'],
  ['comms', 'Key communication', '#1D4ED8'],
  ['cutoff', 'Cut-off date', '#EAB308'],
  ['signoff', 'Sign off', '#DC2626'],
  ['golive', 'Go-live', '#16A34A'],
]

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function isoWeeks(start, end) {
  const out = []
  if (!start || !end) return out
  const [sy, sw] = start.split('-W').map(Number)
  const [ey, ew] = end.split('-W').map(Number)
  if (!sy || !sw || !ey || !ew) return out
  let y = sy
  let w = sw
  while (y < ey || (y === ey && w <= ew)) {
    out.push(`${y}-W${String(w).padStart(2, '0')}`)
    w++
    if (w > 53) {
      w = 1
      y++
    }
    if (out.length > 26) break
  }
  return out
}

export function dateToIsoWeek(iso) {
  try {
    const d = new Date(`${iso}T00:00:00Z`)
    const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7))
    const y = t.getUTCFullYear()
    const y0 = new Date(Date.UTC(y, 0, 1))
    const w = Math.ceil(((t - y0) / 86400000 + 1) / 7)
    return `${y}-W${String(w).padStart(2, '0')}`
  } catch {
    return ''
  }
}

function isoWeekDate(yw) {
  const [y, w] = (yw || '').split('-W').map(Number)
  const jan4 = new Date(Date.UTC(y, 0, 4))
  const day = jan4.getUTCDay() || 7
  const mon = new Date(jan4)
  mon.setUTCDate(jan4.getUTCDate() - day + 1 + (w - 1) * 7)
  return mon
}

export function monthLabel(yw) {
  try {
    const d = isoWeekDate(yw)
    return d.toLocaleString('en-GB', {
      month: 'short',
      year: '2-digit',
      timeZone: 'UTC',
    })
  } catch {
    return ''
  }
}

function wrapTxt(s, n) {
  const t = String(s || '')
  const out = []
  let cur = ''
  t.split(/\s+/).forEach((w) => {
    if (`${cur} ${w}`.trim().length > n) {
      if (cur) out.push(cur)
      cur = w
    } else {
      cur = cur ? `${cur} ${w}` : w
    }
  })
  if (cur) out.push(cur)
  return out.slice(0, 3)
}

export function defaultTimelineRows() {
  return [
    {
      phase: '0. Continuous',
      activity: 'Log your events into the Event Log Tracker (for design enhancements)',
      responsible: 'Product Teams',
      from: 0,
      to: 12,
      kind: 'teal',
      ms: [],
    },
    {
      phase: 'I. Planning & Prep',
      activity: 'Communication received for previous generation go-live',
      responsible: 'Denver Riches',
      from: 0,
      to: 0,
      kind: 'marker',
      ms: [{ at: 0, kind: 'comms', label: 'Gen communication release' }],
    },
    {
      phase: 'I. Planning & Prep',
      activity: 'Reviewing event tracker for open product events',
      responsible: 'Product Teams',
      from: 0,
      to: 1,
      kind: 'magenta',
      ms: [],
    },
    {
      phase: 'I. Planning & Prep',
      activity: 'Alignment on Generation updates for the quarterly release',
      responsible: 'Product Teams',
      from: 2,
      to: 4,
      kind: 'magenta',
      ms: [{ at: 4, kind: 'progress', label: 'Progress update' }],
    },
    {
      phase: 'I. Planning & Prep',
      activity: 'Impact assessment discussions with secondary products',
      responsible: 'Product Teams',
      from: 3,
      to: 5,
      kind: 'magenta',
      ms: [],
    },
    {
      phase: 'II. Validation and design',
      activity: 'Conduct process changes in ARIS',
      responsible: 'Product Teams (CG Support)',
      from: 1,
      to: 7,
      hatchTo: 4,
      kind: 'hatch-magenta',
      ms: [
        { at: 7, kind: 'cutoff', label: 'Cut-off date' },
        { at: 7, kind: 'progress', label: '' },
      ],
    },
    {
      phase: 'II. Validation and design',
      activity: 'Complete the Assessment Template with changes',
      responsible: 'Product Teams (CG Support)',
      from: 1,
      to: 8,
      hatchTo: 4,
      kind: 'hatch-magenta',
      ms: [{ at: 8, kind: 'comms', label: 'Assessment template provided to CG for review' }],
    },
    {
      phase: 'II. Validation and design',
      activity: 'Review changes for completion and integration',
      responsible: 'Capgemini',
      from: 4,
      to: 9,
      hatchTo: 6,
      kind: 'hatch-magenta',
      ms: [{ at: 8, kind: 'comms', label: 'Assessment template comments provided to UL' }],
    },
    {
      phase: 'II. Validation and design',
      activity: 'Any changes or updates to be reviewed and closed',
      responsible: 'Product Teams (CG Support)',
      from: 5,
      to: 8,
      hatchTo: 7,
      kind: 'hatch-magenta',
      ms: [{ at: 8, kind: 'signoff', label: 'Assessment template signed-off (Product Owner)' }],
    },
    {
      phase: 'GCH Cycle',
      activity: 'Governance (WIP) — aspirational go-live in GCH',
      responsible: 'GCH',
      from: 10,
      to: 12,
      kind: 'magenta',
      highlight: '#FFF3B0',
      ms: [],
    },
    {
      phase: 'III. Approvals and sign-offs',
      activity: 'GCAD Control checks',
      responsible: 'Ligia Silva',
      from: 9,
      to: 9,
      kind: 'magenta',
      ms: [{ at: 9, kind: 'comms', label: 'Communication for Ligia to proceed' }],
    },
    {
      phase: 'III. Approvals and sign-offs',
      activity: 'ARIS Team checks for process validity (3–4 days)',
      responsible: 'ARIS Team',
      from: 10,
      to: 11,
      kind: 'magenta',
      ms: [
        { at: 10, kind: 'comms', label: 'Communication for ARIS team to proceed' },
        { at: 11, kind: 'progress', label: '' },
      ],
    },
    {
      phase: 'IV. Go Live',
      activity: 'Go-Live with comms prepared to Product Teams and CCL Process',
      responsible: 'Denver Riches, Capgemini & ARIS Team',
      from: 12,
      to: 12,
      kind: 'magenta',
      ms: [
        { at: 11, kind: 'signoff', label: 'Final Sign Off' },
        { at: 12, kind: 'golive', label: 'Go-Live' },
        { at: 12, kind: 'comms', label: 'Communication to product teams' },
      ],
    },
    {
      phase: 'V. Post go-live',
      activity: 'Complete release notes & Taxonomy Documents',
      responsible: 'D-COE',
      from: 9,
      to: 12,
      hatchTo: 11,
      kind: 'hatch-magenta',
      ms: [],
    },
    {
      phase: 'V. Post go-live',
      activity: 'Update Design Artefacts',
      responsible: 'Capgemini',
      from: 12,
      to: 12,
      kind: 'magenta',
      ms: [],
    },
  ]
}

function mapWeek(i, n) {
  if (n <= 1) return 0
  return Math.max(0, Math.min(n - 1, Math.round((i / 12) * (n - 1))))
}

export function scaleTimelineRows(rows, n) {
  return (rows || []).map((r) => ({
    ...r,
    from: mapWeek(r.from, n),
    to: mapWeek(r.to, n),
    hatchTo: r.hatchTo == null ? null : mapWeek(r.hatchTo, n),
    ms: (r.ms || []).map((m) => ({ ...m, at: mapWeek(m.at, n) })),
  }))
}

export function timelineSvg(gen, mode = 'full') {
  const weeks = isoWeeks(gen.timeline.startWeek, gen.timeline.endWeek)
  const n = Math.max(weeks.length, 1)
  const split = Math.max(1, Math.ceil(n * 0.7))
  let wks = weeks
  let off = 0

  if (mode === 'plan') {
    wks = weeks.slice(0, split)
    off = 0
  } else if (mode === 'golive') {
    wks = weeks.slice(split)
    off = split
    if (!wks.length) {
      wks = weeks.slice(-1)
      off = n - 1
    }
  }

  const nw = wks.length
  const rows = gen.timeline.rows || scaleTimelineRows(defaultTimelineRows(), n)
  const phaseW = 118
  const actW = 268
  const respW = 128
  const left = phaseW + actW + respW
  const colW = Math.max(52, Math.min(72, 900 / nw))
  const W = left + nw * colW + 16
  const hdr = 92
  const rowH = 38
  const H = hdr + rows.length * rowH + 36
  const MAG = '#C2185B'
  const TEAL = '#2BBBAD'
  const NAVY = '#173A6A'
  const GRID = '#D5E2F0'
  const hid = `hatch_${gen.id || 0}_${mode || 'full'}`
  const msFill = {
    progress: '#5EC8C0',
    comms: '#1D4ED8',
    cutoff: '#EAB308',
    signoff: '#DC2626',
    golive: '#16A34A',
  }

  const groups = []
  rows.forEach((r, i) => {
    if (!groups.length || groups[groups.length - 1].phase !== r.phase) {
      groups.push({
        phase: r.phase,
        start: i,
        count: 1,
        color: PHASE_COL[r.phase] || NAVY,
      })
    } else {
      groups[groups.length - 1].count++
    }
  })

  const months = []
  wks.forEach((wk, i) => {
    const m = monthLabel(wk)
    if (!months.length || months[months.length - 1].m !== m) {
      months.push({ m, i, count: 1 })
    } else {
      months[months.length - 1].count++
    }
  })

  const wkIdx = (v) => Math.max(0, Math.min(n - 1, v == null ? 0 : +v))

  let g = `<svg xmlns="http://www.w3.org/2000/svg" class="timeline-svg" viewBox="0 0 ${W} ${H}" width="100%" font-family="Segoe UI,Arial,sans-serif">
 <defs>
  <pattern id="${hid}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#EAF3FB"/><line x1="0" y1="0" x2="0" y2="7" stroke="#7BA7D4" stroke-width="3"/></pattern>
 </defs>
 <rect width="${W}" height="${H}" fill="#ffffff"/>
 <text x="16" y="28" fill="${NAVY}" font-size="15" font-weight="750">The Assets are an Enabler to Support you in Delivering Generational Releases — ${esc(gen.code)}</text>
 <text x="${W - 18}" y="26" fill="#1D4ED8" font-size="15" font-weight="800" text-anchor="end">Unilever</text>
 <g font-size="10" fill="#334155">
  <circle cx="${W - 430}" cy="48" r="6" fill="#5EC8C0"/><text x="${W - 420}" y="52">Progress</text>
  <polygon points="${W - 340},42 ${W - 333},54 ${W - 347},54" fill="#1D4ED8"/><text x="${W - 328}" y="52">Key communication</text>
  <polygon points="${W - 198},42 ${W - 191},54 ${W - 205},54" fill="#EAB308"/><text x="${W - 186}" y="52">Cut-off</text>
  <polygon points="${W - 128},42 ${W - 121},54 ${W - 135},54" fill="#DC2626"/><text x="${W - 116}" y="52">Sign off</text>
  <polygon points="${W - 62},42 ${W - 55},54 ${W - 69},54" fill="#16A34A"/><text x="${W - 50}" y="52">Go-live</text>
 </g>
 <rect x="0" y="${hdr - 32}" width="${phaseW}" height="32" fill="${NAVY}"/><text x="${phaseW / 2}" y="${hdr - 12}" fill="#fff" font-size="10" font-weight="700" text-anchor="middle">Phase</text>
 <rect x="${phaseW}" y="${hdr - 32}" width="${actW}" height="32" fill="${NAVY}"/><text x="${phaseW + 12}" y="${hdr - 12}" fill="#fff" font-size="10" font-weight="700">Activities</text>
 <rect x="${phaseW + actW}" y="${hdr - 32}" width="${respW}" height="32" fill="${NAVY}"/><text x="${phaseW + actW + 8}" y="${hdr - 12}" fill="#fff" font-size="10" font-weight="700">Responsible</text>`

  months.forEach((mo) => {
    const x = left + mo.i * colW
    const w = mo.count * colW
    g += `<rect x="${x}" y="${hdr - 32}" width="${w}" height="16" fill="#2F6FB6"/><text x="${x + w / 2}" y="${hdr - 20}" fill="#fff" font-size="10" font-weight="700" text-anchor="middle">${esc(mo.m)}</text>`
  })

  wks.forEach((wk, i) => {
    const x = left + i * colW
    g += `<rect x="${x}" y="${hdr - 16}" width="${colW}" height="16" fill="#E8F0FA" stroke="${GRID}"/>
  <text x="${x + colW / 2}" y="${hdr - 4}" fill="${NAVY}" font-size="9" font-weight="700" text-anchor="middle">W${i + 1 + off}</text>`
  })

  const gridTop = hdr
  const gridBot = hdr + rows.length * rowH
  for (let i = 0; i <= nw; i++) {
    g += `<line x1="${left + i * colW}" y1="${gridTop}" x2="${left + i * colW}" y2="${gridBot}" stroke="${GRID}"/>`
  }

  groups.forEach((gr) => {
    const y = hdr + gr.start * rowH
    const h = gr.count * rowH
    g += `<rect x="0" y="${y}" width="${phaseW}" height="${h}" fill="${gr.color}" stroke="#fff" stroke-width="1"/>`
    wrapTxt(gr.phase, 16).forEach(
      (ln, k) =>
        (g += `<text x="${phaseW / 2}" y="${y + h / 2 - 6 + k * 12}" fill="${gr.phase === 'GCH Cycle' ? '#1a1a1a' : '#fff'}" font-size="10" font-weight="750" text-anchor="middle">${esc(ln)}</text>`),
    )
  })

  const lastX = left + (nw - 1) * colW
  rows.forEach((r, ri) => {
    const y = hdr + ri * rowH
    const bg = r.highlight || (ri % 2 ? '#F7FBFF' : '#ffffff')
    g += `<rect x="${phaseW}" y="${y}" width="${actW + respW + nw * colW}" height="${rowH}" fill="${bg}" stroke="${GRID}"/>`
    wrapTxt(r.activity, 38).forEach(
      (ln, k) => (g += `<text x="${phaseW + 8}" y="${y + 14 + k * 11}" fill="#1e293b" font-size="10">${esc(ln)}</text>`),
    )
    wrapTxt(r.responsible, 18).forEach(
      (ln, k) => (g += `<text x="${phaseW + actW + 6}" y="${y + 16 + k * 11}" fill="#334155" font-size="9.5">${esc(ln)}</text>`),
    )

    const a = wkIdx(r.from) - off
    const b = wkIdx(r.to) - off

    if (b < 0 || a >= nw) {
      ;(r.ms || []).forEach((m) => {
        const wi = wkIdx(m.at) - off
        if (wi < 0 || wi >= nw) return
        const mx = left + wi * colW + colW / 2
        const my = y + 13
        const fill = msFill[m.kind] || '#1D4ED8'
        if (m.kind === 'progress') {
          g += `<circle cx="${mx}" cy="${my}" r="6" fill="${fill}" stroke="#fff"/>`
        } else {
          g += `<polygon points="${mx},${my - 8} ${mx + 7},${my + 6} ${mx - 7},${my + 6}" fill="${fill}"/>`
        }
      })
      return
    }

    const a0 = Math.max(0, a)
    const b0 = Math.min(nw - 1, b)
    const barY = y + 11
    const barH = 16
    const xOf = (wi) => left + wi * colW + 4

    const drawMag = (s, e) => {
      const x = xOf(s)
      const w = Math.max(14, (e - s + 1) * colW - 10)
      g += `<rect x="${x}" y="${barY}" width="${Math.max(8, w - 8)}" height="${barH}" fill="${MAG}" rx="2"/>
   <polygon points="${x + w - 10},${barY} ${x + w},${barY + barH / 2} ${x + w - 10},${barY + barH}" fill="${MAG}"/>`
    }

    if (r.kind === 'teal') {
      const x = xOf(a0)
      const w = (b0 - a0 + 1) * colW - 8
      g += `<rect x="${x}" y="${barY}" width="${w}" height="${barH}" rx="9" fill="${TEAL}"/>`
    } else if (r.kind === 'hatch-magenta') {
      const ht = wkIdx(r.hatchTo != null ? r.hatchTo : r.from) - off
      const h1 = Math.max(a0, Math.min(b0, ht))
      if (h1 >= a0) {
        const x = xOf(a0)
        const w = (h1 - a0 + 1) * colW - 8
        g += `<rect x="${x}" y="${barY}" width="${w}" height="${barH}" fill="url(#${hid})" stroke="#7BA7D4"/>`
      }
      if (b0 > h1) drawMag(h1 + 1, b0)
    } else if (r.kind === 'magenta' || r.kind === 'marker') {
      if (r.kind === 'magenta') drawMag(a0, b0)
    }

    ;(r.ms || []).forEach((m) => {
      const wi = wkIdx(m.at) - off
      if (wi < 0 || wi >= nw) return
      const mx = left + wi * colW + colW / 2
      const my = barY + 2
      const fill = msFill[m.kind] || '#1D4ED8'
      if (m.kind === 'progress') {
        g += `<circle cx="${mx}" cy="${my + 6}" r="6" fill="${fill}" stroke="#fff" stroke-width="1"/>`
      } else {
        g += `<polygon points="${mx},${my - 2} ${mx + 7},${my + 12} ${mx - 7},${my + 12}" fill="${fill}" stroke="#fff" stroke-width=".6"/>`
      }
    })
  })

  g += `<rect x="${lastX}" y="${hdr}" width="${colW}" height="${rows.length * rowH}" fill="none" stroke="#DC2626" stroke-width="2" stroke-dasharray="5 4"/>
 <text x="${lastX + colW / 2}" y="${hdr - 40}" fill="#DC2626" font-size="9" font-weight="800" text-anchor="middle">Go-Live</text>
 </svg>`

  return g
}

export function paintTimeline(gen) {
  if (!gen?.timeline) return gen
  gen.timeline.svg1 = timelineSvg(gen, 'full')
  gen.timeline.svg2 = timelineSvg(gen, 'golive')
  gen.timeline.svgPlan = timelineSvg(gen, 'plan')
  gen.timeline.updatedAt = new Date().toISOString()
  return gen
}

export function applyTimeline(gen, sw, ew) {
  const n = Math.max(isoWeeks(sw, ew).length, 1)
  gen.timeline = {
    startWeek: sw,
    endWeek: ew,
    rows: scaleTimelineRows(defaultTimelineRows(), n),
    updatedAt: new Date().toISOString(),
  }
  return paintTimeline(gen)
}

export function downloadSvg(svgMarkup, name) {
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.svg`
  a.click()
  URL.revokeObjectURL(url)
}
