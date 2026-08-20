import { useState } from 'react'
import { dateToIsoWeek } from './timelineUtils.js'
import { useGenerations } from './useGenerations.js'
import TimelineEditor from './TimelineEditor.jsx'
import TimelinePreview from './TimelinePreview.jsx'
import './generationTab.css'

function statusBadge(status) {
  const cls =
    status === 'Active'
      ? 'gt-badge gt-s-Active'
      : status === 'Released'
        ? 'gt-badge gt-s-Released'
        : 'gt-badge gt-s-Open'
  return <span className={cls}>{status}</span>
}

function GenerationTab() {
  const {
    generations,
    selected,
    setSelectedId,
    createGeneration,
    updateTimeline,
    deleteGeneration,
    activateGeneration,
    releaseGeneration,
    toast,
  } = useGenerations()

  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({
    code: 'GEN-2026.3',
    name: 'Generation 2026 Q3',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    startWeek: dateToIsoWeek('2026-07-01'),
    endWeek: dateToIsoWeek('2026-09-30'),
  })

  const onDateChange = (field, value) => {
    setForm((f) => {
      const next = { ...f, [field]: value }
      if (field === 'startDate') next.startWeek = dateToIsoWeek(value) || f.startWeek
      if (field === 'endDate') next.endWeek = dateToIsoWeek(value) || f.endWeek
      return next
    })
  }

  const handleCreate = () => {
    const { code, name, startDate, endDate, startWeek, endWeek } = form
    if (!code.trim() || !name.trim()) {
      alert('Generation code and name are required.')
      return
    }
    if (!startDate || !endDate) {
      alert('Generation Start Date and End Date are mandatory.')
      return
    }
    if (endDate < startDate) {
      alert('End Date must be on or after Start Date.')
      return
    }
    if (!startWeek || !endWeek) {
      alert('Start week and End week are mandatory.')
      return
    }
    if (!/^20\d{2}-W\d{2}$/.test(startWeek) || !/^20\d{2}-W\d{2}$/.test(endWeek)) {
      alert('Use ISO week format YYYY-Www e.g. 2026-W27.')
      return
    }
    createGeneration({
      code: code.trim(),
      name: name.trim(),
      startDate,
      endDate,
      startWeek,
      endWeek,
    })
  }

  return (
    <div className="gt-app">
      {toast && <div className="gt-toast">{toast}</div>}

      <div className="gt-ph">
        <div>
          <h1>Generations</h1>
          <p>Create a generation and the Gen-10 timeline is drawn in the same place.</p>
        </div>
      </div>

      <div className="gt-alert gt-alert-i">
        Only one generation can be <strong>Active</strong> at a time. Dates fill ISO weeks; Create
        draws the Gantt below this form.
      </div>

      <div className="gt-card gt-card-teal">
        <div className="gt-ct">Create generation &amp; timeline</div>

        <div className="gt-fr">
          <div className="gt-fg">
            <label>
              Generation Code <span className="gt-req">*</span>
            </label>
            <input
              type="text"
              className="gt-sample"
              value={form.code}
              placeholder="e.g. GEN-2026.3"
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            />
          </div>
          <div className="gt-fg">
            <label>
              Generation Name <span className="gt-req">*</span>
            </label>
            <input
              type="text"
              className="gt-sample"
              value={form.name}
              placeholder="e.g. Generation 2026 Q3"
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
        </div>

        <div className="gt-fr">
          <div className="gt-fg">
            <label>
              Generation Start Date <span className="gt-req">*</span>
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => onDateChange('startDate', e.target.value)}
            />
          </div>
          <div className="gt-fg">
            <label>
              Generation End Date <span className="gt-req">*</span>
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => onDateChange('endDate', e.target.value)}
            />
          </div>
        </div>

        <div className="gt-fr">
          <div className="gt-fg">
            <label>
              Start week <span className="gt-req">*</span>
            </label>
            <input
              type="text"
              value={form.startWeek}
              placeholder="2026-W27"
              onChange={(e) => setForm((f) => ({ ...f, startWeek: e.target.value }))}
            />
          </div>
          <div className="gt-fg">
            <label>
              End week <span className="gt-req">*</span>
            </label>
            <input
              type="text"
              value={form.endWeek}
              placeholder="2026-W39"
              onChange={(e) => setForm((f) => ({ ...f, endWeek: e.target.value }))}
            />
          </div>
        </div>

        <div className="gt-fh gt-mb">
          Dates are mandatory. Weeks auto-fill from dates. The timeline appears under this button
          after create.
        </div>

        <div className="gt-br gt-mb">
          <button type="button" className="gt-btn gt-btn-p" onClick={handleCreate}>
            Create generation &amp; generate timeline
          </button>
        </div>

        {selected && (
          <TimelinePreview
            generations={generations}
            selected={selected}
            onSelect={setSelectedId}
            onEdit={() => setEditOpen(true)}
          />
        )}
      </div>

      <div className="gt-card">
        <div className="gt-ct">All generations</div>
        <div className="gt-tw">
          <table className="gt-d">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th className="gt-num">Events</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {generations.map((g) => (
                <tr key={g.id}>
                  <td className="gt-mono">{g.code}</td>
                  <td>{g.name}</td>
                  <td className="gt-mono">{g.startDate || '—'}</td>
                  <td className="gt-mono">{g.endDate || '—'}</td>
                  <td>{statusBadge(g.status)}</td>
                  <td className="gt-num">0</td>
                  <td>
                    <div className="gt-br">
                      {g.status === 'Released' ? (
                        <button
                          type="button"
                          className="gt-btn gt-btn-sm"
                          onClick={() => setSelectedId(g.id)}
                        >
                          View timeline
                        </button>
                      ) : g.status === 'Active' ? (
                        <button
                          type="button"
                          className="gt-btn gt-btn-sm gt-btn-s"
                          onClick={() => releaseGeneration(g.id)}
                        >
                          Release
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="gt-btn gt-btn-sm"
                          onClick={() => activateGeneration(g.id)}
                        >
                          Activate
                        </button>
                      )}
                      <button
                        type="button"
                        className="gt-btn gt-btn-sm"
                        onClick={() => setSelectedId(g.id)}
                      >
                        Timeline
                      </button>
                      <button
                        type="button"
                        className="gt-btn gt-btn-sm gt-btn-d"
                        onClick={() => deleteGeneration(g.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editOpen && selected?.timeline && (
        <TimelineEditor
          generation={selected}
          onClose={() => setEditOpen(false)}
          onSave={(rows) => {
            updateTimeline(selected.id, rows)
            setEditOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default GenerationTab
