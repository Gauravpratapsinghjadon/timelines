export const releaseTimelineModel = {
  title: 'Unilever - Gen 10 (Release Timeline)',
  colWidth: 98,
  rowHeight: 66,
  labelWidth: 360,
  colors: {
    progress: '#2FBF71',
    keyCommunication: '#FFB020',
    signOff: '#6D28D9',
    goLive: '#2563EB',
    cutOff: '#DC2626',
  },
  legendItems: [
    { label: 'Progress Updates', color: '#2FBF71' },
    { label: 'Key Communication', color: '#FFB020' },
    { label: 'Cut-off Date', color: '#DC2626' },
    { label: 'Sign Off', color: '#6D28D9' },
    { label: 'Go-Live', color: '#2563EB' },
  ],
  weeks: ['W10', 'W11', 'W12', 'W13'],
  months: [
    { label: 'September/26', startIndex: 0, endIndex: 3 },
  ],
  cutOffIndex: 2,
  signOffIndex: 3,
  goLiveIndex: 3,
  rows: [
    {
      id: 'log-tracker',
      phase: '0. Continuous (Ongoing Activities)',
      phaseColor: '#0EA5A4',
      responsible: 'Product Teams',
      text: 'Log your events into the Event Log Tracker',
      bars: [
        {
          startIndex: 0,
          endIndex: 3,
          color: 'rgba(46, 204, 113, 0.28)',
          borderColor: 'rgba(46, 204, 113, 0.55)',
          textColor: '#0f5132',
          label: 'Event Log Tracking',
          variant: 'striped',
        },
      ],
    },
    {
      id: 'validation-integration',
      phase: 'II. Validation and design',
      phaseColor: '#22C55E',
      responsible: 'Capgemini',
      text: 'Review changes for completion and integration',
      bars: [
        {
          startIndex: 0,
          endIndex: 1,
          color: 'rgba(59, 130, 246, 0.20)',
          borderColor: 'rgba(59, 130, 246, 0.40)',
          textColor: '#1d4ed8',
          label: 'Validation',
        },
      ],
    },
    {
      id: 'gch-cycle',
      phase: 'GCH Cycle Governance (WIP)',
      phaseColor: '#A855F7',
      responsible: '',
      text: 'GCH Cycle Governance / WIP checks',
      bars: [
        {
          startIndex: 1,
          endIndex: 3,
          color: 'rgba(168, 85, 247, 0.25)',
          borderColor: 'rgba(168, 85, 247, 0.55)',
          textColor: '#4c1d95',
          label: 'Aspirational go-live in GCH',
          variant: 'striped',
        },
      ],
    },
    {
      id: 'gcad-control',
      phase: 'III. Approvals and sign-offs',
      phaseColor: '#111827',
      responsible: 'Ligia Silva',
      text: 'GCAD control checks',
      bars: [
        {
          startIndex: 1,
          endIndex: 2,
          color: 'rgba(109, 40, 217, 0.28)',
          borderColor: 'rgba(109, 40, 217, 0.55)',
          textColor: '#ffffff',
          label: 'Ligia Silva',
        },
      ],
    },
    {
      id: 'aris-checks',
      phase: 'III. Approvals and sign-offs',
      phaseColor: '#0B1320',
      responsible: 'ARIS Team',
      text: 'ARIS Team checks for process validity (3-4 days)',
      bars: [
        {
          startIndex: 1,
          endIndex: 2,
          color: 'rgba(255, 176, 32, 0.25)',
          borderColor: 'rgba(255, 176, 32, 0.55)',
          textColor: '#92400e',
          label: 'ARIS Team',
          variant: 'striped',
        },
      ],
    },
    {
      id: 'go-live',
      phase: 'Go-Live',
      phaseColor: '#1E3A8A',
      responsible: 'Denver Riches, Capgemini & ARIS Team',
      text: 'Go-live with Comms prepared to Product Teams and CCL Process',
      bars: [
        {
          startIndex: 2,
          endIndex: 3,
          color: 'rgba(37, 99, 235, 0.20)',
          borderColor: 'rgba(37, 99, 235, 0.45)',
          textColor: '#1d4ed8',
          label: 'Go-Live',
        },
      ],
    },
  ],
}

export default releaseTimelineModel

