import { useCallback, useEffect, useState } from 'react'
import { applyTimeline, paintTimeline, scaleTimelineRows, defaultTimelineRows, isoWeeks } from './timelineUtils.js'

const STORAGE_KEY = 'generation-tab-data-v1'

function seedGenerations() {
  const g1 = {
    id: 1,
    code: 'GEN-2025.4',
    name: 'Generation 2025 Q4',
    status: 'Released',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
  }
  const g2 = {
    id: 2,
    code: 'GEN-2026.1',
    name: 'Generation 2026 Q1',
    status: 'Active',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
  }
  const g3 = {
    id: 3,
    code: 'GEN-2026.2',
    name: 'Generation 2026 Q2',
    status: 'Open',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
  }

  applyTimeline(g2, '2026-W01', '2026-W13')
  return { genSeq: 3, generations: [g1, g2, g3] }
}

function repairGeneration(g) {
  if (!g.timeline?.startWeek || !g.timeline?.endWeek) return g
  const n = Math.max(isoWeeks(g.timeline.startWeek, g.timeline.endWeek).length, 1)
  if (!g.timeline.rows?.length || !g.timeline.rows[0]?.kind) {
    g.timeline.rows = scaleTimelineRows(defaultTimelineRows(), n)
  }
  return paintTimeline(g)
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      parsed.generations = (parsed.generations || []).map(repairGeneration)
      return parsed
    }
  } catch {
    /* ignore */
  }
  return seedGenerations()
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useGenerations() {
  const [state, setState] = useState(loadState)
  const [selectedId, setSelectedId] = useState(() => {
    const s = loadState()
    return s.generations.find((g) => g.status === 'Active')?.id ?? s.generations[0]?.id ?? null
  })
  const [toast, setToast] = useState('')

  useEffect(() => {
    saveState(state)
  }, [state])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3200)
  }, [])

  const generations = [...state.generations].sort((a, b) => b.id - a.id)
  const selected = generations.find((g) => g.id === selectedId) ?? generations[0] ?? null

  const updateGenerations = useCallback((updater) => {
    setState((prev) => ({
      ...prev,
      generations: typeof updater === 'function' ? updater(prev.generations) : updater,
    }))
  }, [])

  const createGeneration = useCallback(
    ({ code, name, startDate, endDate, startWeek, endWeek }) => {
      const id = state.genSeq + 1
      let g = {
        id,
        code,
        name,
        status: 'Open',
        startDate,
        endDate,
      }
      g = applyTimeline(g, startWeek, endWeek)
      setState((prev) => ({
        genSeq: id,
        generations: [...prev.generations, g],
      }))
      setSelectedId(id)
      showToast(`Generation ${code} created with merged timeline.`)
      return g
    },
    [state.genSeq, showToast],
  )

  const updateTimeline = useCallback(
    (genId, rows) => {
      updateGenerations((gens) =>
        gens.map((g) => {
          if (g.id !== genId) return g
          const next = {
            ...g,
            timeline: { ...g.timeline, rows: rows.map((r) => ({ ...r, ms: (r.ms || []).map((m) => ({ ...m })) })) },
          }
          return paintTimeline(next)
        }),
      )
      showToast('Timeline image updated.')
    },
    [updateGenerations, showToast],
  )

  const regenerateTimeline = useCallback(
    (genId, startWeek, endWeek) => {
      updateGenerations((gens) =>
        gens.map((g) => {
          if (g.id !== genId) return g
          return applyTimeline({ ...g }, startWeek, endWeek)
        }),
      )
      showToast('Timeline generated.')
    },
    [updateGenerations, showToast],
  )

  const deleteGeneration = useCallback(
    (id) => {
      updateGenerations((gens) => gens.filter((g) => g.id !== id))
      setSelectedId((cur) => (cur === id ? null : cur))
      showToast('Generation deleted.')
    },
    [updateGenerations, showToast],
  )

  const activateGeneration = useCallback(
    (id) => {
      updateGenerations((gens) =>
        gens.map((g) => ({
          ...g,
          status: g.id === id ? 'Active' : g.status === 'Active' ? 'Open' : g.status,
        })),
      )
      showToast('Generation activated.')
    },
    [updateGenerations, showToast],
  )

  const releaseGeneration = useCallback(
    (id) => {
      updateGenerations((gens) =>
        gens.map((g) => (g.id === id ? { ...g, status: 'Released' } : g)),
      )
      showToast('Generation released.')
    },
    [updateGenerations, showToast],
  )

  return {
    generations,
    selected,
    selectedId,
    setSelectedId,
    createGeneration,
    updateTimeline,
    regenerateTimeline,
    deleteGeneration,
    activateGeneration,
    releaseGeneration,
    toast,
  }
}
